// @ts-nocheck
import {
    Button,
    Container,
    Grid,
    Typography,
    Divider,
    Stack,
    Card,
    LinearProgress,
    CardMedia,
    CardContent,
    Avatar,
    Dialog,
    TextField,
    DialogTitle,
    DialogContent,
    Box,
} from "@mui/material";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { ArrowForward, FavoriteBorder } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useReadEvent, useNostrEventIdDecode, useNostrReactions, useNostrProfile } from "./Hooks";
import { Zap, createZap, isNullOrEmpty } from "../utils/Utils";
import ZeumInputTextField from "./styled/ZeumInputTextField";
import { useNostr, useProfile } from "nostr-react";
import { nip19, nip57 } from "nostr-tools";
import { Lightning } from "@phosphor-icons/react";
import { useZeumStore } from "./ZeumStore";
import { toast } from "react-toastify";

export const Home = () => {
    return (
        <Container sx={{ height: "100vh", backgroundColor: "#fff", overflow: "auto", maxWidth: "100% !important" }}>
            <Grid container justifyContent="center">
                <Grid item xs={12} marginTop={10}>
                    <ZeumHeader />
                    <ZeumInput />
                </Grid>
                <Grid item xs={12} marginTop={8}>
                    <FeaturedZeums />
                </Grid>
                <Grid item xs={12} marginY={10}>
                    <CreatedBy />
                    <Grid container textAlign="center" justifyContent="center" marginTop={4}>
                        <SupportUs npub="npub1xk50nsp89sge5cs0glq9tjxm885lsp077xez6zm6g2ccjdga4enqnkmr0f" />
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
};

const EnterZeumButton = ({ decodedEventId, variant = "contained", disabled = false }) => {
    const navigate = useNavigate();

    const handleEnterZeum = useCallback(() => {
        navigate(`./${decodedEventId}`);
    }, [decodedEventId, navigate]);

    return (
        // @ts-ignore
        <Button onClick={handleEnterZeum} variant={variant} disabled={disabled}>
            Enter <ArrowForward fontSize="small" />
        </Button>
    );
};

const ZeumHeader = () => {
    return (
        <Grid container justifyContent="center" marginBottom={6}>
            <Grid item xs={12} textAlign="center">
                <Typography variant="h1" fontWeight={600}>
                    Zeum
                </Typography>
            </Grid>
            <Grid item xs={12} textAlign="center" marginTop={3}>
                <Typography fontSize="16">The internet museum</Typography>
            </Grid>
            <Grid item xs={12} marginTop={3} justifyContent="center" textAlign="center">
                <Divider sx={{ maxWidth: "300px", marginLeft: "auto", marginRight: "auto" }} />
            </Grid>
        </Grid>
    );
};

const ZeumInput = () => {
    const [eventIdInput, setEventIdInput] = useState("");
    const { decodedId, isValid, validationError } = useNostrEventIdDecode({
        eventIdInput,
    });

    const handleEventIdChange = useCallback((e) => {
        const value = e.target.value.toLowerCase();
        setEventIdInput(value);
    }, []);

    return (
        <Container maxWidth="lg" sx={{ marginTop: 4 }}>
            <Typography variant="h6">
                <strong>Load a zeum</strong>
            </Typography>
            <ZeumInputTextField
                hiddenLabel
                onChange={handleEventIdChange}
                value={eventIdInput}
                placeholder="Enter the ID of a note
                with images"
                error={!isValid}
                helperText={validationError?.message}
                fullWidth
                sx={{ marginTop: 3 }}
            />

            <Grid container item justifyContent="center" marginTop={4}>
                <EnterZeumButton decodedEventId={decodedId} disabled={!isValid} />
            </Grid>
        </Container>
    );
};

const FeaturedZeums = () => {
    return (
        <Container maxWidth="lg">
            <Typography variant="h6">
                <strong>Featured zeums</strong>
            </Typography>
            <Grid container justifyContent="center" sx={{ marginTop: 1 }} spacing={2}>
                <Grid item xs={12} md={4}>
                    <ZeumCard eventId="note1u82apcqdsjlupk0mtaykcfnmx7mz0ha2tz349dh0e7dn6qxfnprsyf0ye2" />
                </Grid>
                <Grid item xs={12} md={4}>
                    <ZeumCard eventId="note1h7l2wtc8zy83ltewvw6r8q6j86k0mzhamq67psm0lrrp560syhfqqtvsqu" />
                </Grid>
                <Grid item xs={12} md={4}>
                    <ZeumCard eventId="note1qqqqfg2zwvz6tjtflf6mgn9tdn4cv0r6dh2qqpydj4w3kh6286wq2zx90k" />
                </Grid>
            </Grid>
        </Container>
    );
};

const ZeumCard = ({ eventId }) => {
    const { eventText, pubkey, decodedId, tags, images, isLoading, isError, error } = useReadEvent(eventId);
    const { reactions } = useNostrReactions(eventId);
    const { profile } = useNostrProfile(pubkey);

    if (isError) console.error(error);

    if (!images?.length) return null;

    return (
        <Card sx={{ boxShadow: "3px 3px black" }}>
            {isLoading && <LinearProgress />}
            <CardMedia component="img" height="192" image={images[0]} />
            <CardContent sx={{ paddingBottom: "10px !important" }}>
                <Grid container justifyContent="space-between" spacing={1}>
                    <Grid item xs={12}>
                        <Typography
                            variant="h6"
                            sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                width: "100%",
                            }}
                        >
                            {!isNullOrEmpty(eventText) ? eventText : "Untitled"}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ paddingTop: "0 !important" }}>
                        <Typography
                            component="a"
                            href={profile?.npub ? `https://primal.net/p/${profile?.npub}` : undefined}
                            variant="body1"
                            color="primary"
                            fontSize={14}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            @{profile?.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {images?.length} artifact{images?.length > 1 ? "s" : ""} | {reactions?.length ?? 0} reactions
                    </Grid>
                    <Grid item xs={12}>
                        <Stack direction="row" spacing={1}>
                            <Typography
                                variant="body2"
                                color="primary"
                                fontSize={14}
                                sx={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    width: "100%",
                                }}
                            >
                                {tags?.slice(0, 5)?.map((tag) => `#${tag} `)}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid container justifyContent="flex-end" item xs={12}>
                        <EnterZeumButton decodedEventId={decodedId} variant="text" />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

const CreatedBy = () => {
    return (
        <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} textAlign="center">
                <Typography variant="h6">
                    <strong>Created by:</strong>
                </Typography>
            </Grid>
            <Grid item xs={12} textAlign="center">
                <Stack spacing={3} textAlign="center">
                    <NostrFeaturedAvatar npub="npub1xk50nsp89sge5cs0glq9tjxm885lsp077xez6zm6g2ccjdga4enqnkmr0f" />
                    <NostrFeaturedAvatar npub="npub1wfl0hjv07uvma6zd93cz9w5vxhg6xfvla74tcv4wsymals0729zsg3er8n" />
                </Stack>
            </Grid>
        </Grid>
    );
};

const SupportUs = ({ npub }) => {
    const pubkey = nip19.decode(npub)?.data;
    const { signedInAs } = useZeumStore();
    const { connectedRelays, publish } = useNostr();
    const [showZapModal, setShowZapModal] = useState(false);
    const [showSignInModal, setShowSignInModal] = useState(false);
    const [amount, setAmount] = useState(0);
    const [comment, setComment] = useState("");

    const handleClick = useCallback(
        () => (!!signedInAs ? setShowZapModal(true) : setShowSignInModal(true)),
        [signedInAs]
    );

    return (
        <>
            <ZapDialog show={showZapModal} setShow={setShowZapModal} pubkey={pubkey} />
            <SignInDialog show={showSignInModal} setShow={setShowSignInModal} />
            <Button variant="outlined" endIcon={<FavoriteBorder />} onClick={handleClick}>
                <Typography fontWeight={600}>Support</Typography>
            </Button>
        </>
    );
};

const SignInDialog = ({ show, setShow }) => {
    const { signedInAs, setSignedInAs } = useZeumStore();
    const handleClose = () => setShow(false);

    const handleSingInWithExtension = useCallback(async () => {
        const nostrExtension = window?.nostr ?? null;

        if (!signedInAs && nostrExtension) {
            try {
                const publicKey = (await nostrExtension?.getPublicKey()) ?? null;
                setSignedInAs(publicKey);
            } catch (e) {
                console.error(e);
            } 
        }
    }, [setSignedInAs, signedInAs]);

    return (
        <Dialog open={show && !signedInAs} onClose={handleClose} fullWidth>
            <DialogTitle>
                <Grid container item xs={12} alignItems="center">
                    <Avatar src="apple-touch-icon.png" sx={{ marginRight: 1 }} /> Sign In
                </Grid>
            </DialogTitle>
            <DialogContent>
                <Stack direction="column">
                    <Button variant="contained" sx={{ marginTop: 3 }} onClick={handleSingInWithExtension}>
                        Sign in with extension
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

const ZapDialog = ({ pubkey, show, setShow }) => {
    const { signedInAs, nostrExtension } = useZeumStore();
    const { connectedRelays } = useNostr();
    const [amount, setAmount] = useState(0);
    const [comment, setComment] = useState("");
    const { data: profile } = useProfile({ pubkey, enabled: !!pubkey });
    const handleZapModalClose = () => setShow(false);

    const handleZap = useCallback(async () => {
        const zapInvoice = await Zap({ comment, relays: connectedRelays?.map((relay) => relay?.url), amount, pubkey: signedInAs, target: profile, nostrExtension });
        if (!zapInvoice) toast.error("Error zapping Zeum.space");
        toast.success(`Zapped Zeum.space ${amount} sats`);
        setShow(false);
    }, [comment, connectedRelays, amount, signedInAs, profile, nostrExtension, setShow]);


    return (
        <Dialog open={show} onClose={handleZapModalClose} fullWidth>
            <DialogTitle>
                <Grid container item xs={12} alignItems="center">
                    <Avatar src="apple-touch-icon.png" sx={{ marginRight: 1 }} /> Send sats to Zeum.space
                </Grid>
            </DialogTitle>
            <DialogContent>
                <Typography variant="subtitle1">Zap amount in sats</Typography>
                <Grid container spacing={1} justifyContent="center" marginBottom={1}>
                    <Grid item xs={12} md={4}>
                        <Button
                            variant={amount === 1000 ? "contained" : "outlined"}
                            onClick={() => setAmount(1000)}
                            fullWidth
                        >
                            1k
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button
                            variant={amount === 5000 ? "contained" : "outlined"}
                            onClick={() => setAmount(5000)}
                            fullWidth
                        >
                            5k
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button
                            variant={amount === 10000 ? "contained" : "outlined"}
                            onClick={() => setAmount(10000)}
                            fullWidth
                        >
                            10k
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button
                            variant={amount === 20000 ? "contained" : "outlined"}
                            onClick={() => setAmount(20000)}
                            fullWidth
                        >
                            20k
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button
                            variant={amount === 100000 ? "contained" : "outlined"}
                            onClick={() => setAmount(100000)}
                            fullWidth
                        >
                            100k
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button
                            variant={amount === 500000 ? "contained" : "outlined"}
                            onClick={() => setAmount(500000)}
                            fullWidth
                        >
                            500k
                        </Button>
                    </Grid>
                </Grid>

                <TextField
                    hiddenLabel
                    placeholder="Comment"
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={(e) => setComment(e.target.value)}
                    multiline
                    sx={{ marginBottom: 2 }}
                />

                <Button variant="contained" onClick={handleZap} sx={{ textTransform: "none" }} fullWidth>
                    <Lightning weight="fill" /> <Typography>Zap Zeum.space</Typography>
                </Button>
            </DialogContent>
        </Dialog>
    );
};

const NostrFeaturedAvatar = ({ npub }) => {
    const decodedPubkey = nip19.decode(npub);
    // @ts-ignore
    const { data: profile } = useProfile({ pubkey: decodedPubkey?.data, enabled: !!decodedPubkey?.data });

    return (
        <Stack>
            <Box>
                <Avatar
                    component="a"
                    href={profile?.npub ? `https://primal.net/p/${profile?.npub}` : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textDecoration: "none", width: 100, height: 100, margin: "auto" }}
                    src={profile?.picture}
                />
                <Typography>{profile?.name}</Typography>
            </Box>
        </Stack>
    );
};
