import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

class DataValue {
  @prop({ required: true })
  public value!: string;
}

class FtpData {
  @prop({ required: true })
  public username!: string;

  @prop({ type: () => [String] })
  public cols!: string[];

  @prop({ type: () => [String] })
  public rows!: string[];

  @prop({ type: () => [[DataValue]] })
  public data!: DataValue[][];
}

export const FtpDataModel = getModelForClass(FtpData);
