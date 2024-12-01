// "use client";
// import { error } from "console";
// import React, {
//   FunctionComponent,
//   ReactElement,
//   useCallback,
//   useContext,
//   useEffect,
// } from "react";
// import { io, Socket } from "socket.io-client";

// interface ISocketContext {
//   getSocket: () => void;
//   publishMessage: (msg: string) => void;
// }

// interface ISocketProvider {
//   children: React.ReactNode;
// }

// const SocketContext = React.createContext<ISocketContext | null>(null);

// export const useSocket = () => {
//   const values = useContext(SocketContext);
//   return values;
// };

// export const SocketProvider: FunctionComponent<ISocketProvider> = ({
//   children,
// }): ReactElement => {
//   const publishMessage = useCallback((msg: string) => {
//     console.log(msg);
//   }, []);

//   useEffect(() => {
//     const socket = io("http://localhost:7070");
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <SocketContext.Provider value={{ publishMessage }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };
