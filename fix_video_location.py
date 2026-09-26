with open('src/components/Category/CategoryContent.tsx', 'r') as f:
    content = f.read()

# Define the exact video block to remove
video_block_to_remove = """            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
              className="flex gap-4 items-start px-4 mt-6"
            >
              <div className="w-full">
                    {/* Conditional Video Block (Shows ONLY below thumbnails when a valid video exists for the selected grade) */}
                    {selectedGradeVideos.length > 0 && currentVideoUrl && (
                      <div className="mt-8 flex flex-col items-center w-full animate-fade-in">


                        <div
                          ref={videoContainerRef}
                          className="h-[500px] w-[300px] flex items-center justify-center bg-white border border-gray-200 rounded shadow-sm overflow-hidden cursor-zoom-in relative"
                          onMouseMove={handleVideoMouseMove}
                          onMouseEnter={() => setIsVideoZoomed(true)}
                          onMouseLeave={() => setIsVideoZoomed(false)}
                        >
                          <video
                            ref={mainVideoRef}
                            key={currentVideoUrl} // Remounts video when src changes
                            src={currentVideoUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className={`w-full h-full object-cover transition-transform duration-100 ease-linear ${isVideoZoomed ? "scale-[2]" : "scale-[1]"
                              }`}
                            style={{
                              transformOrigin: `${videoZoomPos.x}% ${videoZoomPos.y}%`,
                            }}
                          />

                          {isVideoZoomed && (
                            <div className="absolute inset-0 border-[3px] border-black/30 rounded pointer-events-none" />
                          )}

                          <button
                            onClick={(e) => handleShareVideo(e, currentVideoUrl)}
                            disabled={isSharingVideo}
                            className="absolute top-2 right-2 z-10 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all disabled:opacity-50"
                            title="Share Video"
                            aria-label="Share Video"
                          >
                            {isSharingVideo ? <Loader size={20} color="white" /> : <IconShare size={20} stroke={1.5} />}
                          </button>
                        </div>

                        {/* Video Thumbnails Carousel (Only visible if > 1 video) */}
                        {selectedGradeVideos.length > 1 && (
                          <div className="mt-4 w-full max-w-[300px]">
                            <Carousel
                              slideSize="33.333333%"
                              slideGap="sm"
                              controlsOffset="xs"
                              nextControlProps={{ "aria-label": "Next slide" }}
                              previousControlProps={{ "aria-label": "Previous slide" }}
                            >
                              {selectedGradeVideos.map((video: any, index: number) => (
                                <Carousel.Slide key={video.public_id || index}>
                                  <div
                                    className={`cursor-pointer border-2 rounded p-1 transition-all ${activeVideoIndex === index
                                      ? "border-black shadow-md"
                                      : "border-transparent hover:border-gray-300"
                                      }`}
                                    onClick={() => setActiveVideoIndex(index)}
                                  >
                                    <video
                                      src={video.video_url}
                                      className="w-full h-16 object-cover rounded pointer-events-none"
                                      muted
                                      playsInline
                                    />
                                  </div>
                                </Carousel.Slide>
                              ))}
                            </Carousel>
                          </div>
                        )}
                      </div>
                    )}

              </div>
            </motion.div>"""

inner_video_block = """                    {/* Conditional Video Block (Shows ONLY below thumbnails when a valid video exists for the selected grade) */}
                    {selectedGradeVideos.length > 0 && currentVideoUrl && (
                      <div className="mt-8 flex flex-col items-center w-full animate-fade-in">


                        <div
                          ref={videoContainerRef}
                          className="h-[500px] w-[300px] flex items-center justify-center bg-white border border-gray-200 rounded shadow-sm overflow-hidden cursor-zoom-in relative"
                          onMouseMove={handleVideoMouseMove}
                          onMouseEnter={() => setIsVideoZoomed(true)}
                          onMouseLeave={() => setIsVideoZoomed(false)}
                        >
                          <video
                            ref={mainVideoRef}
                            key={currentVideoUrl} // Remounts video when src changes
                            src={currentVideoUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className={`w-full h-full object-cover transition-transform duration-100 ease-linear ${isVideoZoomed ? "scale-[2]" : "scale-[1]"
                              }`}
                            style={{
                              transformOrigin: `${videoZoomPos.x}% ${videoZoomPos.y}%`,
                            }}
                          />

                          {isVideoZoomed && (
                            <div className="absolute inset-0 border-[3px] border-black/30 rounded pointer-events-none" />
                          )}

                          <button
                            onClick={(e) => handleShareVideo(e, currentVideoUrl)}
                            disabled={isSharingVideo}
                            className="absolute top-2 right-2 z-10 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all disabled:opacity-50"
                            title="Share Video"
                            aria-label="Share Video"
                          >
                            {isSharingVideo ? <Loader size={20} color="white" /> : <IconShare size={20} stroke={1.5} />}
                          </button>
                        </div>

                        {/* Video Thumbnails Carousel (Only visible if > 1 video) */}
                        {selectedGradeVideos.length > 1 && (
                          <div className="mt-4 w-full max-w-[300px]">
                            <Carousel
                              slideSize="33.333333%"
                              slideGap="sm"
                              controlsOffset="xs"
                              nextControlProps={{ "aria-label": "Next slide" }}
                              previousControlProps={{ "aria-label": "Previous slide" }}
                            >
                              {selectedGradeVideos.map((video: any, index: number) => (
                                <Carousel.Slide key={video.public_id || index}>
                                  <div
                                    className={`cursor-pointer border-2 rounded p-1 transition-all ${activeVideoIndex === index
                                      ? "border-black shadow-md"
                                      : "border-transparent hover:border-gray-300"
                                      }`}
                                    onClick={() => setActiveVideoIndex(index)}
                                  >
                                    <video
                                      src={video.video_url}
                                      className="w-full h-16 object-cover rounded pointer-events-none"
                                      muted
                                      playsInline
                                    />
                                  </div>
                                </Carousel.Slide>
                              ))}
                            </Carousel>
                          </div>
                        )}
                      </div>
                    )}"""


if video_block_to_remove in content:
    print("Found video block in right column, removing...")
    content = content.replace(video_block_to_remove, "")
else:
    print("WARNING: Could not find exact video block to remove.")

target_left = """                    </div>


                  </div>
                ) : ("""

replacement_left = "                    </div>\n\n" + inner_video_block + "\n\n                  </div>\n                ) : ("

if target_left in content:
    print("Found target in left column, inserting...")
    content = content.replace(target_left, replacement_left)
else:
    print("WARNING: Could not find insertion point in left column.")
    
with open('src/components/Category/CategoryContent.tsx', 'w') as f:
    f.write(content)
