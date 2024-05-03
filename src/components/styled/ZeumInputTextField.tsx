import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

const ZeumInputTextField = styled(TextField)({
    marginTop: 3,
    "& .MuiOutlinedInput-root": {
        border: "3px solid black",
        ":hover": { 
            border: "3px solid black",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "1px solid",
        },
    },
});

ZeumInputTextField.defaultProps = {
    InputProps: {
        sx: {
            borderRadius: 10,
            border: "3px solid black",
            ":hover": { 
                border: "3px solid black",
            },
        },
    },
};

export default ZeumInputTextField;