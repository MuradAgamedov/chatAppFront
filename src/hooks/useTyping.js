export const useTyping = ({
  connectionRef,
  currentUser,
  user
}) => {
  const handleTyping = () => {
    if (connectionRef.current && user ?.id) {
      connectionRef.current
        .invoke("SendTypingNotification", user.id, currentUser.user.id)
        .catch((err) => console.error("Typing invoke xətası:", err));
    }
  };

  return {
    handleTyping
  };
};
