export const useKeyListener = (props) => {
  const { target, event, callbacks } = props;

  const handleEvent = (event) => {
    Object.keys(callbacks).forEach((key) => {
      if (event.key === key) callbacks[key](event);
    });
  };

  const connect = () => {
    target.addEventListener(event, handleEvent);
  };

  const disconnect = () => {
    target.removeEventListener(event, handleEvent);
  };

  return {
    connect,
    disconnect,
  };
};
