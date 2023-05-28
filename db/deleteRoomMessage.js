/**
 * deleteRoomMessage - 특정 룸의 메세지를 모두 삭제 (Deletes all messages in a specific room.)
 * @param {object} client - MongoDB 클라이언트.
 * @param {string} room - 모든 메세지를 삭제하고자 하는 room의 이름.
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