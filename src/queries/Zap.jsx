import { useQuery } from "react-query";

export const useGetPayRequestCallback = (lnurl) =>
    useQuery(["payRequestCallback", lnurl], async () => {
        const response = await fetch(lnurl);
        return response?.json();
    }, { enabled: !!lnurl});

// export const useGetPayReceipt = (lnurl) =>
//     useQuery(["payRequestCallback", lnurl], async () => {
//         const response = await fetch(lnurl);
//         return response?.json();
//     }, { enabled: !!lnurl});
