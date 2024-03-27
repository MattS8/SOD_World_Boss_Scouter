const HashMap = require('hashmap');
const TimedMessages = new HashMap();

function deleteMessage(id) {
    const expiredMessage = TimedMessages.get(id);
    try {
        expiredMessage?.callback?.();
        expiredMessage.message.delete().catch(console.error);
    } catch (error) {}
}

module.exports = (DiscordClient) => {
    DiscordClient.handleTimedMessage = async (id, message, duration, callback = null) => {
        // Check for duplicates
        if (TimedMessages.has(id)) {
            console.warn(`A timed message with the id ${id} was already found! Deleting old message first...`);
            deleteMessage(id);
        }

        TimedMessages.set(id, {
            message: message,
            duration: duration,
            callback: callback
        });

        setTimeout(deleteMessage, duration, id)
    }
}
