import React, { createContext, useState, useRef, useEffect } from 'react';
import { Socket, io } from 'socket.io-client';
import Peer from 'simple-peer';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

type SocketContextType = {
  call: any,
  callAccepted: boolean,
  myVideo: any,
  userVideo: any,
  stream: any,
  name: string,
  setName: (name: string) => void,
  callEnded: boolean,
  me: string,
  callUser: (id: string) => void,
  leaveCall: () => void,
  answerCall: () => void,
};

type ContextProviderProps = {
  children: React.ReactNode;
};

type CallType = {
  isReceivingCall?: boolean;
  from?: string;
  name?: string;
  signal?: any;
};

type UserInRoom = {
  username: string;
  id: string;
  room: string;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState<MediaStream | undefined>()
  const [name, setName] = useState('');
  const [call, setCall] = useState<CallType>({});
  const [me, setMe] = useState('');

  const [usersInRoom, setUsersInRoom] = useState<UserInRoom[]>([]);

  const myVideo = useRef<HTMLVideoElement | null>(null);
  const userVideo = useRef<HTMLVideoElement | null>(null);
  const connectionRef = useRef<Peer.Instance | null>(null);

  const { data: session } = useSession();
  const router = useRouter();
  const roomId = router.query.id;

  // socket conection

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!socket) {
      const newSocket = io('http://localhost:4000');
      setSocket(newSocket);
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);
  // socket conection

  useEffect(() => {

    socket.on('me', (id: string) => {
      setMe(id);
    });

    socket.emit('get_me');

    socket.on('callUser', ({ from, name, callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

    // socket.emit('get_users_in_room', roomId);

    // Then, initialize the media devices
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (session && session.user) {
      setName(session.user.name as string)
    }

    if (name && roomId) {
      socket.emit('join_room', { username: name, room: roomId });

      socket.on('users_in_room', (users) => {
        console.log("USERS", users)
        setUsersInRoom(users);
      });
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, roomId])



  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current!.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id: string) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current!.srcObject = currentStream;
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current!.destroy();

    window.location.reload();
  };

  // const sendMessage = () => {
  //   if (message !== '') {
  //     socket.current!.emit('send_message', { roomId, username, message });
  //     setMessage(''); // Clear the message input
  //   }
  // };

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };