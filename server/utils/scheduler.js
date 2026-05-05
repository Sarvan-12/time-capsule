const cron = require('node-cron');
const Capsule = require('../models/Capsule');
const Notification = require('../models/Notification');
const sendEmail = require('./sendEmail');

const deliverCapsules = async () => {
  try {
    // Find all sealed capsules whose unlock date has passed
    const capsules = await Capsule.find({
      status: 'sealed',
      unlockDate: { $lte: new Date() },
      deliveredAt: null,
    }).populate('creator', 'name email');

    for (const capsule of capsules) {
      console.log(`Delivering capsule: ${capsule.title} (${capsule._id})`);

      // Email delivery
      if (capsule.deliveryMode === 'email' || capsule.deliveryMode === 'both') {
        for (const recipient of capsule.recipients) {
          try {
            await sendEmail({
              email: recipient.email,
              subject: `🎉 Your Time Capsule "${capsule.title}" has been unlocked!`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0;">🕰️ Time Capsule Unlocked!</h1>
                  </div>
                  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
                    <h2 style="color: #1f2937;">${capsule.title}</h2>
                    <p style="color: #4b5563;">From: <strong>${capsule.creator.name}</strong></p>
                    <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
                      ${capsule.content}
                    </div>
                    <p style="color: #6b7280; font-size: 12px;">This capsule was created on ${capsule.createdAt.toLocaleDateString()} and scheduled for delivery on ${capsule.unlockDate.toLocaleDateString()}.</p>
                  </div>
                </div>
              `,
            });
          } catch (emailErr) {
            console.error(`Failed to send email to ${recipient.email}:`, emailErr.message);
          }
        }
      }

      // In-app notification delivery
      if (capsule.deliveryMode === 'in-app' || capsule.deliveryMode === 'both') {
        for (const recipient of capsule.recipients) {
          if (recipient.userId) {
            await Notification.create({
              userId: recipient.userId,
              message: `Time Capsule "${capsule.title}" from ${capsule.creator.name} has been unlocked!`,
              type: 'capsule_received',
              capsuleId: capsule._id,
            });
          }
        }

        // Also notify the creator
        await Notification.create({
          userId: capsule.creator._id,
          message: `Your Time Capsule "${capsule.title}" has been delivered!`,
          type: 'capsule_delivered',
          capsuleId: capsule._id,
        });
      }

      // Mark as delivered
      capsule.status = 'delivered';
      capsule.deliveredAt = new Date();
      await capsule.save();

      // Handle recurring capsules
      if (capsule.isRecurring && capsule.recurringInterval === 'yearly') {
        const newUnlockDate = new Date(capsule.unlockDate);
        newUnlockDate.setFullYear(newUnlockDate.getFullYear() + 1);

        await Capsule.create({
          title: capsule.title,
          content: capsule.content,
          coverImage: capsule.coverImage,
          media: capsule.media,
          tags: capsule.tags,
          creator: capsule.creator._id,
          recipients: capsule.recipients,
          unlockDate: newUnlockDate,
          deliveryMode: capsule.deliveryMode,
          privacy: capsule.privacy,
          status: 'sealed',
          isRecurring: true,
          recurringInterval: 'yearly',
        });

        console.log(`Recurring capsule cloned with new unlock date: ${newUnlockDate}`);
      }

      console.log(`Capsule "${capsule.title}" delivered successfully.`);
    }

    if (capsules.length > 0) {
      console.log(`${capsules.length} capsule(s) delivered.`);
    }
  } catch (err) {
    console.error('Scheduler error:', err.message);
  }
};

// Run every 1 minute
const startScheduler = () => {
  cron.schedule('* * * * *', () => {
    console.log('Running capsule delivery check...');
    deliverCapsules();
  });

  console.log('Capsule delivery scheduler started (runs every 1 minute)');
};

module.exports = startScheduler;
