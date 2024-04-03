import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { HydratedDocument } from 'mongoose';

class Location {
  @Prop({ type: Array, required: true })
  coordinates: [number, number]; //tuple of coordinates [lat , long]
}

class Pollution {
  @Prop({ type: String })
  ts: string;

  @Prop({ type: Number, index: true })
  aqius: number;

  @Prop({ type: String })
  mainus: string;

  @Prop({ type: Number })
  aqicn: number;

  @Prop({ type: String })
  maincn: string;
}

class Weather {
  @Prop({ type: String })
  ts: string;

  @Prop({ type: Number })
  tp: number;

  @Prop({ type: Number })
  pr: number;

  @Prop({ type: Number })
  hu: number;

  @Prop({ type: Number })
  ws: number;

  @Prop({ type: Number })
  wd: number;

  @Prop({ type: String })
  ic: string;
}

class Current {
  @Prop({
    type: Pollution,
  })
  @ValidateNested()
  @Type(() => Pollution)
  pollution: Pollution;

  @Prop({
    type: Weather,
  })
  @ValidateNested()
  @Type(() => Weather)
  weather: Weather;
}

@Schema({ versionKey: false, timestamps: true })
export class AirQuality {
  @Prop({ type: String })
  city: string;

  @Prop({ type: String })
  state: string;

  @Prop({ type: String })
  country: string;

  @Prop({
    type: Location,
  })
  @ValidateNested()
  @Type(() => Location)
  location: Location;

  @Prop({
    type: Current,
  })
  @ValidateNested()
  @Type(() => Current)
  current: Current;
}

export const airQualitySchema = SchemaFactory.createForClass(AirQuality);
export type airQualityDocument = HydratedDocument<AirQuality>;
