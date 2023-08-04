import { FaPoundSign } from "react-icons/fa";
import { FaBitcoin, FaBrazilianRealSign, FaDollarSign, FaEthereum, FaEuroSign, FaRubleSign, FaYenSign } from "react-icons/fa6";
import { type IconType } from "react-icons/lib";

export const currencyIconMap: Record<string, IconType> = {
    'BTC': FaBitcoin,
    'USD': FaDollarSign,
    'BRL': FaBrazilianRealSign,
    'EUR': FaEuroSign,
    'GBP': FaPoundSign,
    'JPY': FaYenSign,
    'RUB': FaRubleSign,
    'ETH': FaEthereum
}
