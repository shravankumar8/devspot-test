"use client";

import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GenericModal, { ModalControls } from "@/components/ui/generic-modal";
import { Spinner } from "@/components/ui/spinner";
import "blueimp-canvas-to-blob";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type ReactCropProps,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ProfileCropperProps extends ModalControls, Partial<ReactCropProps> {
  aspectRatio?: number;
  src: string | null;
  handleFileCropped: (file: File) => void;
  isLoading?: boolean;
  isHeader?: boolean;
}

const ImageCropper = (props: ProfileCropperProps) => {
  const [crop, setCrop] = useState<Crop>();
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);

  const {
    aspectRatio = 1,
    src,
    isLoading,
    handleFileCropped,
    isOpen,
    onClose,
    onOpen,
    isHeader = false,
    ...rest
  } = props;

  const onImageLoad = useCallback((img: HTMLImageElement) => {
    imageRef.current = img;

    const { width, height } = img;

    const initialCrop = {
      height: 160,
      unit: "px",
      width,
      x: 0,
      y: 0,
    };

    const centerAspect = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspectRatio,
        width,
        height
      ),
      width,
      height
    );

    if (isHeader) {
      setCrop(initialCrop as Crop);
    } else {
      setCrop(centerAspect);
    }
  }, []);

  const cropImage = useCallback(() => {
    if (completedCrop && imageRef.current) {
      const image = imageRef.current;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("No 2d context");
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const pixelRatio = window.devicePixelRatio;

      canvas.width = scaleX * completedCrop.width * pixelRatio;
      canvas.height = scaleY * completedCrop.height * pixelRatio;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.log("toBlob failed, using polyfill...");
            // Polyfill logic in case toBlob is still not working
            var binStr = atob(
                canvas.toDataURL("image/jpeg", 0.8).split(",")[1]
              ),
              len = binStr.length,
              arr = new Uint8Array(len);

            for (var i = 0; i < len; i++) {
              arr[i] = binStr.charCodeAt(i);
            }

            const polyfilledBlob = new Blob([arr], { type: "image/jpeg" });

            const file = new File([polyfilledBlob], "profile-image.jpg", {
              type: "image/jpeg",
            });

            handleFileCropped(file); // Pass the file to the parent component
            return;
          }

          // If toBlob works, proceed as usual
          const file = new File([blob], "profile-image.jpg", {
            type: "image/jpeg", // You can dynamically set this based on the image
          });

          handleFileCropped(file); // Pass the file to the parent component
        },
        "image/jpeg",
        0.8
      );
    }
  }, [completedCrop, handleFileCropped]);

  return (
    <GenericModal
      controls={{
        isOpen,
        onClose,
        onOpen,
      }}
    >
      <div className="flex flex-col justify-between h-full">
        <DialogHeader className="top-0 left-6 sticky bg-[#1B1B22] py-2">
          <DialogTitle className="font-semibold !text-[24px]">
            Crop Photo
          </DialogTitle>
        </DialogHeader>

        {/* Styles Applied in Global.css */}
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          keepSelection
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspectRatio}
          locked={isHeader}
          {...rest}
        >
          <Image
            ref={imageRef}
            alt="Crop me"
            src={src || "/placeholder.svg"}
            width={400}
            height={400}
            className={`w-full h-full !max-h-[400px] ${
              isHeader ? "object-cover" : "object-contain"
            }`}
            onLoad={(e) => onImageLoad(e.currentTarget)}
          />
        </ReactCrop>

        <div className="flex justify-center sm:justify-end gap-6 mt-12 w-full">
          <Button
            variant="secondary"
            disabled={isLoading}
            onClick={onClose}
            className="gap-2 font-roboto text-base"
          >
            Cancel
          </Button>

          <Button
            className="gap-2 font-roboto text-base"
            disabled={isLoading}
            onClick={cropImage}
          >
            {isLoading && <Spinner size="small" />}
            Save photo
          </Button>
        </div>
      </div>
    </GenericModal>
  );
};

export default ImageCropper;
