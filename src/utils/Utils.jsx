export function findImageUrlsInEvent(event: any) {
    const regex = /(https?:\/\/[^\s]+\.(?:jpg|png|gif|jpeg|webp|mp4))/gi;

    return event?.content?.match(regex);
}
