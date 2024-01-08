export function findImageUrlsInEvent(event) {
    const regex = /(https?:\/\/[^\s]+?\.(jpg|png|gif|jpeg|webp|mp4)([^\s]*))/gi;

    return event?.content?.match(regex);
}

export function getEventText(event) {
    const regex = /(https?:\/\/[^\s]+?\.(jpg|png|gif|jpeg|webp|mp4)([^\s]*))|(#\w+)/gi;
    return event?.content?.replace(regex, "");
}

export function getEventHashTags(selectedEvent) {
    return [
        ...new Set(
            selectedEvent.tags
                .map((tag) => (tag?.at(0) === "t" ? tag?.at(1) : null))
                .filter((tag) => !isNullOrEmpty(tag))
        ),
    ];
}

export function getRandomRange(min, max) {
    return Math.random() * (max - min) + min;
}

export function isNullOrEmpty(value) {
    if (value == null) {
        return true;
    }

    if (typeof value === "string" && value.trim() === "") {
        return true;
    }

    if (Array.isArray(value) && value.length === 0) {
        return true;
    }

    if (typeof value === "object" && Object.keys(value).length === 0) {
        return true;
    }

    return false;
}
