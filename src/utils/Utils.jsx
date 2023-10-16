export function findImageUrlsInEvent(event) {
    const regex = /(https?:\/\/[^\s]+\.(?:jpg|png|gif|jpeg|webp|mp4))/gi;

    return event?.content?.match(regex);
}

export function getRandomRange(min, max) {
    return Math.random() * (max - min) + min;
}
