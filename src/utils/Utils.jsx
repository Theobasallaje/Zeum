import { useNostr } from "nostr-react";
import { kinds } from "nostr-tools";
import { useZeumStore } from "../components/ZeumStore";
import { bech32 } from "bech32";
import { useGetPayRequestCallback } from "../queries/Zap";
import { useMemo } from "react";
import axios from "axios";
import { Buffer } from "buffer";
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

const encodeLNURL = (url) => {
    const words = bech32.toWords(Buffer.from(url));
    return bech32.encode("lnurl", words);
};

const decodeLNURL = (lnurl) => {
    const decoded = bech32.decode(lnurl);
    return Buffer.from(bech32.fromWords(decoded.words)).toString();
};

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

export const Zap = async ({ comment, relays, amount, pubkey, target }) => {
    let event;
    let walletCallbackResponse;
    let callback;
    let lnurl;

    try {
        if (target?.lud06?.length > 0) {
            const lAddress = target?.lud06;
            if (!lAddress) return;

            lnurl = encodeLNURL(lAddress);

            walletCallbackResponse = await axios.get(lnurl);
            callback = walletCallbackResponse?.data?.callback;
        } else if (target?.lud16?.length > 0) {
            const addressParts = target.lud16.split("@");

            if (addressParts?.length !== 2) return;

            const domain = addressParts[1];
            const username = addressParts[0];

            lnurl = encodeLNURL(target.lud16);
            walletCallbackResponse = await axios.get(`https://${domain}/.well-known/lnurlp/${username}`);
            callback = walletCallbackResponse?.data?.callback;
        }

        event = encodeURI(
            JSON.stringify(
                window?.nostr?.signEvent({
                    kind: 9734,
                    content: "",
                    created_at: Math.round(Date.now() / 1000),
                    tags: [
                        ["relays", ...relays],
                        ["amount", amount.toString()],
                        ["lnurl", lnurl],
                        ["p", target.npub],
                    ],
                })
            )
        );
        const {pr: invoice} = (await axios.get(`${callback}?amount=${amount}&nostr=${event}&lnurl=${lnurl}`))?.data;
        return invoice;
    } catch (e) {
        console.error(e);
    }
};
