import { UserAgent } from './userAgentModel';
import { VideoCallChat } from "./videoCallChatModel";
import { DeletedTimeline } from "./deletedTimelineModel";
import { DeletedUserPhoto } from "./deletedUserPhotosModel";
import { Timeline } from "./timelineModel";
import { getModelForClass } from "@typegoose/typegoose";

export const TimeLineModel = getModelForClass(Timeline);
export const DeletedTimelineModel = getModelForClass(DeletedTimeline);
export const DeletedUserPhotoModel = getModelForClass(DeletedUserPhoto);
export const VideoCallChatModel = getModelForClass(VideoCallChat);
export const UserAgentModel = getModelForClass(UserAgent);

// add other models here