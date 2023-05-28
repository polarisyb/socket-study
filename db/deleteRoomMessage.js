/**
 * deleteRoomMessage - 특정 룸의 메세지를 모두 삭제 (Deletes all messages in a specific room.)
 * @param {object} client - The MongoDB client.
 * @param {string} room - The room identifier.
*/
const deleteRoomMessage = async (client, room) => {
  try {
    const db = client.db('Chat-app');
    const collection = db.collection('message');

    const filter = { room: room };

    const result = await collection.deleteMany(filter);

    console.log(`Deleted ${result.deletedCount} documents`);

  } catch (err) {
    console.error('Error deleting documents:', err);
  }
};

module.exports = deleteRoomMessage;