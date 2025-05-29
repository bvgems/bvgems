import ReactImageMagnify from "react-image-magnify";

export function ZoomImage({ imageUrl }: { imageUrl: string }) {
  return (
    <div style={{ width: "400px" }}>
      <ReactImageMagnify
        {...{
          smallImage: {
            alt: "Zoom Image",
            isFluidWidth: true,
            src: imageUrl,
          },
          largeImage: {
            src: imageUrl,
            width: 1200,
            height: 1200,
          },
          enlargedImageContainerStyle: { zIndex: 100 },
          lensStyle: { backgroundColor: "rgba(0,0,0,.3)" },
        }}
      />
    </div>
  );
}
