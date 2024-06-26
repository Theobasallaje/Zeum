import { nip19, nip57 } from "nostr-tools";

export const canDecode = (identifier) => {
    if (identifier.charAt(0) !== 'n') return false
    return true
  }
  
  export const isHex = (identifier) => {
    const hexRegex = /^[0-9a-fA-F]{64}$/
    return hexRegex.test(identifier)
  }
  
  export const isUUIDv4 = (identifier) => {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
    return uuidRegex.test(identifier)
  }

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

export const fetchInvoice = async ({ zapEndpoint, amount, comment, authorId, noteId, normalizedRelays }) => {
    const zapEvent = await makeZapEvent({
        profile: authorId,
        event: noteId ? nip19.decode(noteId) : undefined,
        amount,
        relays: normalizedRelays,
        comment,
    });
    
    let url = `${zapEndpoint}?amount=${amount}&nostr=${encodeURIComponent(JSON.stringify(zapEvent))}`;

    if (comment) {
        url = `${url}&comment=${encodeURIComponent(comment)}`;
    }

    const res = await fetch(url);
    const { pr: invoice } = await res.json();

    return invoice;
};

const makeZapEvent = async ({ profile, event, amount, relays, comment }) => {
    const zapEvent = nip57.makeZapRequest({
        profile,
        event,
        amount,
        relays,
        comment,
    });

    return window?.nostr?.signEvent(zapEvent);
};

export const satToMsat = (msat) => msat * 1000;