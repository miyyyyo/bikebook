import { useState, useEffect, useRef, useContext } from 'react';
import { ClientConfig, IAgoraRTCRemoteUser, createClient, createMicrophoneAndCameraTracks } from 'agora-rtc-react';
import { useRouter } from 'next/router';
import { SocketContext } from '@/context/VideoCallContext';
import VideoCallChatBox from './VideoCallChatBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';


const config = { mode: "rtc", codec: "vp8", appid: "c2a17faedf124435a895dab019e37429" };

const useClient = createClient(config as ClientConfig);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const VideoCallPage = () => {

    const router = useRouter();
    const channelName = router.query.id as string;

    const [inCall, setInCall] = useState(false);
    const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
    const [isClientReady, setIsClientReady] = useState(false);

    const client = useClient();
    const { ready, tracks } = useMicrophoneAndCameraTracks();

    const localVideoRef = useRef<HTMLDivElement>(null);

    const context = useContext(SocketContext);

    if (!context) {
        throw new Error("You must use this component within a <ContextProvider>");
    }

    const { usersInRoom, setRoomName, roomName } = context

    useEffect(() => {
        setRoomName(channelName)
        if (ready && tracks && !isClientReady) {
            client.join(config.appid, channelName, null).then(uid => {
                client.publish(tracks);
                setInCall(true);
                setIsClientReady(true);  // Set the client as ready after joining
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client, tracks, ready, isClientReady, channelName]);

    // This useEffect handles the local video track
    useEffect(() => {
        if (tracks && localVideoRef.current) {
            tracks[1].play(localVideoRef.current);
            return () => {
                tracks[1].stop();
                tracks[1].close();
            };
        }
    }, [tracks]);

    // This useEffect handles user-published events and other client events
    useEffect(() => {
        const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'video' | 'audio') => {
            await client.subscribe(user, mediaType);
            if (mediaType === 'video' && user.videoTrack) {
                setRemoteUsers(prevUsers => [...prevUsers, user]);
                user.videoTrack.play(`video-${user.uid}`);
            }
            if (mediaType === 'audio' && user.audioTrack) {
                user.audioTrack.play();
            }
        };

        const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
            setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
        };

        client.on('user-published', handleUserPublished);
        client.on('user-unpublished', handleUserUnpublished);

        return () => {
            client.off('user-published', handleUserPublished);
            client.off('user-unpublished', handleUserUnpublished);
        };
    }, [client]);

    // This useEffect handles client disconnection
    useEffect(() => {
        const handleClientDisconnected = () => {
            setIsClientReady(false);
        };
        client.on('disconnected', handleClientDisconnected);
        return () => {
            client.off('disconnected', handleClientDisconnected);
        };
    }, [client]);

    useEffect(() => {
        remoteUsers.forEach(user => {
            if (user.videoTrack) {
                user.videoTrack.play(`video-${user.uid}`);
            }
        });
    }, [remoteUsers]);

    return (
        <div className="w-full h-screen grid grid-rows-5 grid-cols-3 gap-2">

            <div className="border-2 col-span-3 row-span-3">

                {/* Remote Streams */}
                {remoteUsers.map(user => (
                    <div
                        key={user.uid}
                        id={`video-${user.uid}`}
                        className="w-full h-full border-2 rounded-md mb-4"
                    ></div>
                ))}
            </div>

            <div className="border-2 col-span-3 row-span-2 flex">


                <div className="w-2/3 border-2 p-4 rounded-md mb-4 " >

                    {/* Chat Display */}
                    <div className="border-2 rounded p-2 sticky top-0 bg-slate-200 flex gap-2 z-20 justify-between">
                        <div>
                            {usersInRoom.map(({ name }, index) => (
                                <div key={index} className="">
                                    <strong className="text-blue-500">{name}</strong>
                                </div>
                            ))}
                        </div>
                        <div>
                            {roomName &&
                                <div className="flex">
                                    <p>Comparte este link: {`${process.env.NEXT_PUBLIC_BASE_URL}/videocall/${roomName}`}</p>
                                    <button className="ml-2" onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL}/videocall/${roomName}`); }} >
                                        <FontAwesomeIcon icon={faCopy} className='text-slate-500' />
                                    </button>
                                </div>
                            }
                        </div>
                    </div>

                    <div className="h-[80%] b-4 overflow-y-auto">
                        <VideoCallChatBox />
                    </div>

                </div>

                {/* Local Stream */}
                <div className="w-1/3 border-2 rounded-md mb-4">
                    <div
                        ref={localVideoRef}
                        className="w-full h-full"
                    ></div>
                </div>


            </div>
        </div>
    );

}

export default VideoCallPage;