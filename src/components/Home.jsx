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
    Chip,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import React, { useState, useCallback } from "react";
import { ArrowForward, ContentCopy, FavoriteBorder, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useReadEvent, useNostrEventIdDecode, useNostrReactions, useNostrProfile } from "./Hooks";
import { fetchInvoice, isNullOrEmpty } from "../utils/Utils";
import ZeumInputTextField from "./styled/ZeumInputTextField";
import { useNostr, useProfile } from "nostr-react";
import { nip19, nip57 } from "nostr-tools";
import { Lightning } from "@phosphor-icons/react";
import { useZeumStore } from "./ZeumStore";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";
import { cacheLightningUri, getCachedLightningUri, getProfileMetadata } from "../utils/Zap";

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
                    <FeaturedAvatar npub="npub1xk50nsp89sge5cs0glq9tjxm885lsp077xez6zm6g2ccjdga4enqnkmr0f" />
                    <FeaturedAvatar npub="npub1wfl0hjv07uvma6zd93cz9w5vxhg6xfvla74tcv4wsymals0729zsg3er8n" />
                </Stack>
            </Grid>
        </Grid>
    );
};

const SupportUs = ({ npub }) => {
    const pubkey = nip19.decode(npub)?.data;
    const [showZapModal, setShowZapModal] = useState(false);
    const [showSignInModal, setShowSignInModal] = useState(false);
    const [invoice, setInvoice] = useState(null);
    const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);

    const handleClick = useCallback(() => setShowZapModal(true), []);

    return (
        <>
            <ZapDialog
                show={showZapModal}
                setShow={setShowZapModal}
                setShowInvoiceDialog={setShowInvoiceDialog}
                pubkey={pubkey}
                setInvoice={setInvoice}
            />
            <SignInDialog show={showSignInModal} setShow={setShowSignInModal} />
            {invoice ? (
                <InvoiceDialog
                    invoice={invoice}
                    setInvoice={setInvoice}
                    show={showInvoiceDialog}
                    setShow={setShowInvoiceDialog}
                />
            ) : null}
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
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <Close />
            </IconButton>
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

const ZapDialog = ({ pubkey, show, setShow, setInvoice, setShowInvoiceDialog }) => {
    const { connectedRelays } = useNostr();
    const normalizedRelays = connectedRelays?.map((relay) => relay.url);
    const [amount, setAmount] = useState(0);
    const [comment, setComment] = useState("");
    const handleClose = () => setShow(false);

    const handleZap = useCallback(async () => {
        const profileMetadata = await getProfileMetadata(pubkey, normalizedRelays);
        const zapEndpoint = await nip57.getZapEndpoint(profileMetadata);
        try {
            const invoice = await fetchInvoice({
                zapEndpoint,
                amount,
                comment,
                authorId: pubkey,
                normalizedRelays,
            });
            if (window.webln) {
                try {
                    console.info("Attempting to send payment automatically.");
                    await window.webln.enable();
                    await window.webln.sendPayment(invoice);
                    setShow(false);
                } catch (e) {
                    console.info("Couldn't send payment automatically. Showing invoice.");
                    setInvoice(invoice);
                    setShow(false);
                    setShowInvoiceDialog(true);
                }
            } else {
                console.info("No webln available. Showing invoice.");
                setInvoice(invoice);
                setShow(false);
                setShowInvoiceDialog(true);
            }
        } catch (error) {
            console.error(error);
        }
    }, [pubkey, amount, comment, normalizedRelays, setInvoice, setShow, setShowInvoiceDialog]);

    return (
        <Dialog open={show} onClose={handleClose} fullWidth>
            <DialogTitle>
                <Grid container item xs={12} alignItems="center">
                    <Avatar src="apple-touch-icon.png" sx={{ marginRight: 1 }} /> Send sats to Zeum.space
                </Grid>
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <Close />
            </IconButton>
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

const InvoiceDialog = ({ invoice, setInvoice, show, setShow }) => {
    const [lightningUri, setLightningUri] = useState(getCachedLightningUri);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(invoice);
        toast.success("Invoice copied to clipboard");
    }, [invoice]);

    const handleClose = useCallback(() => {
        setShow(false);
        setInvoice(null);
    }, [setInvoice, setShow]);

    const handleLigningUriChange = useCallback((e) => {
        const value = e.target.value;
        setLightningUri(value);
    }, []);

    const handleOpenWallet = useCallback(() => {
        cacheLightningUri(lightningUri);
        window.open(`${lightningUri}${invoice}`, "_blank");
    }, [invoice, lightningUri]);

    const walletOptions = [
        { label: "Default Wallet", value: "lightning:" },
        { label: "Strike", value: "strike:lightning:" },
        { label: "Cash App", value: "https://cash.app/launch/lightning/" },
        { label: "Muun", value: "muun:" },
        { label: "Blue Wallet", value: "bluewallet:lightning:" },
        { label: "Wallet of Satoshi", value: "walletofsatoshi:lightning:" },
        { label: "Zebedee", value: "zebedee:lightning:" },
        { label: "Zeus LN", value: "zeusln:lightning:" },
        { label: "Phoenix", value: "phoenix://" },
        { label: "Breez", value: "breez:" },
        { label: "Bitcoin Beach", value: "bitcoinbeach://" },
        { label: "Blixt", value: "blixtwallet:lightning:" },
        { label: "River", value: "river://" },
    ];

    return (
        <Dialog open={show} onClose={handleClose} fullWidth>
            <DialogTitle>
                <Grid container item xs={12} alignItems="center">
                    <Avatar src="apple-touch-icon.png" sx={{ marginRight: 1 }} /> Invoice
                </Grid>
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <Close />
            </IconButton>
            <DialogContent>
                <Grid container justifyContent="center" spacing={2}>
                    <Grid item xs={12} textAlign="center">
                        <Box >
                            <QRCode size={256} value={invoice} viewBox={`0 0 256 256`} />
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Chip
                            label={invoice}
                            sx={{ marginTop: 2, textAlign: "center", textOverflow: "ellipsis" }}
                            onClick={handleCopy}
                            icon={<ContentCopy fontSize="18" />}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl size="small" sx={{ minWidth: 240 }} fullWidth>
                            <InputLabel id="wallet-select-label">Wallet</InputLabel>
                            <Select
                                labelId="wallet-select-label"
                                id="wallet-select"
                                value={lightningUri}
                                label="Wallet"
                                onChange={handleLigningUriChange}
                            >
                                {walletOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={handleOpenWallet} sx={{ textTransform: "none" }} fullWidth>
                            Open Wallet
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

const FeaturedAvatar = ({ npub }) => {
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
