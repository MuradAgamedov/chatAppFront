const ReplyPreview = ({ message, onCancel }) => {
  if (!message) return null;

  return (
    <div className="bg-yellow-100 p-2 rounded mb-2">
      <p className="text-sm text-gray-700">
        Вы отвечаете на сообщение: {message.content}
      </p>
      <button
        className="text-xs text-red-600 mt-1"
        onClick={onCancel}
      >
        Отменить
      </button>
    </div>
  );
};


export default ReplyPreview;