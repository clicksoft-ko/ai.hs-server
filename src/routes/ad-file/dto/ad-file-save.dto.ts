import Joi from "joi";

export interface AdFileSaveDto {
  fileName: string;
  fileType: "image" | "video";
}

export const adFileSaveScheam = Joi.object<AdFileSaveDto>({
  fileName: Joi.string().required(),
  fileType: Joi.string().valid('image', 'video').required(),
})