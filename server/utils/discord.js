import axios from 'axios';

const sendOrderNotification = async (orderData) => {
    try {
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

        if (!webhookUrl || webhookUrl === 'https://discord.com/api/webhooks/YOUR_WEBHOOK_URL') {
            console.log('Discord webhook not configured, skipping notification');
            return;
        }

        const embed = {
            title: '🎉 New Order Received',
            color: 0x3B82F6,
            fields: [
                { name: '👤 Customer', value: `${orderData.userName}\n${orderData.userEmail}\nDiscord: ${orderData.userDiscord || 'N/A'}`, inline: true },
                { name: '📦 Plan', value: orderData.planName, inline: true },
                { name: '💰 Payment Details', value: `Original: ₹${orderData.originalPrice}\nDiscount: ₹${orderData.discountAmount}\n**Final: ₹${orderData.finalPrice}**`, inline: true },
                { name: '🎫 Promo Code', value: orderData.promoCode || 'None', inline: true },
                { name: '🆔 Order ID', value: `#${orderData.orderId}`, inline: true },
                { name: '📅 Date', value: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }), inline: true }
            ],
            footer: { text: 'Hostia - Order Management System' },
            timestamp: new Date().toISOString()
        };

        if (orderData.transactionId) {
            embed.fields.push({ name: '🔖 Transaction ID', value: orderData.transactionId, inline: false });
        }

        const payload = { embeds: [embed] };

        if (orderData.screenshotUrl) {
            payload.embeds[0].image = { url: orderData.screenshotUrl };
            payload.embeds[0].description = '📸 Payment screenshot attached below';
        }

        await axios.post(webhookUrl, payload);
        console.log('✓ Discord notification sent successfully');
    } catch (error) {
        console.error('Error sending Discord notification:', error.message);
    }
};

const sendOrderUpdateNotification = async (orderData, status, adminAction) => {
    try {
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

        if (!webhookUrl || webhookUrl === 'https://discord.com/api/webhooks/YOUR_WEBHOOK_URL') {
            return;
        }

        let color, title, statusEmoji;

        if (status === 'payment_verified') {
            color = 0x10B981;
            title = '✅ Order Approved';
            statusEmoji = '✅';
        } else if (status === 'rejected') {
            color = 0xEF4444;
            title = '❌ Order Rejected';
            statusEmoji = '❌';
        }

        const embed = {
            title: title,
            color: color,
            fields: [
                { name: '🆔 Order ID', value: `#${orderData.orderId}`, inline: true },
                { name: '👤 Customer', value: orderData.userName, inline: true },
                { name: `${statusEmoji} Status`, value: status === 'payment_verified' ? 'Active' : 'Rejected', inline: true }
            ],
            footer: { text: `Action by: ${adminAction.adminEmail}` },
            timestamp: new Date().toISOString()
        };

        if (status === 'rejected' && orderData.rejectionReason) {
            embed.fields.push({ name: '📝 Rejection Reason', value: orderData.rejectionReason, inline: false });
        }

        await axios.post(webhookUrl, { embeds: [embed] });
    } catch (error) {
        console.error('Error sending Discord update notification:', error.message);
    }
};

export { sendOrderNotification, sendOrderUpdateNotification };
