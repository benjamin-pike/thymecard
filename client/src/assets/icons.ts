import { BiFridge, BiLink } from 'react-icons/bi';
import { BsChevronDown } from 'react-icons/bs';
import { GrFormSearch } from 'react-icons/gr';
import { HiOutlineDocumentAdd, HiOutlineDocumentDuplicate } from 'react-icons/hi';
import { IoIosClose, IoMdRefresh } from 'react-icons/io';
import { IoCloseOutline } from 'react-icons/io5';
import { LuLogIn, LuMoreHorizontal } from 'react-icons/lu';
import { MdFilterList } from 'react-icons/md';
import { PiBarcode, PiBookmarkSimpleFill, PiDownloadSimple, PiForkKnifeBold, PiListBold, PiMinus, PiPencilSimple, PiPlus } from 'react-icons/pi';
import { RiKnifeLine, RiStarLine } from 'react-icons/ri';
import { TbChefHat, TbFileUpload, TbListCheck, TbPlaylistAdd } from 'react-icons/tb';

export const ICONS = {
    common: {
        XSmall: IoIosClose,
        XLarge: IoCloseOutline,
        search: GrFormSearch,
        toggle: BsChevronDown,
        star: RiStarLine,
        plus: PiPlus,
        minus: PiMinus,
        ellipsis: LuMoreHorizontal,
        list: PiListBold
    },
    dashboard: {},
    planner: {},
    recipes: {
        link: BiLink,
        chef: TbChefHat,
        create: PiPencilSimple,
        upload: TbFileUpload,
        duplicate: HiOutlineDocumentDuplicate,
        add: HiOutlineDocumentAdd,
        filter: MdFilterList,
        servings: PiForkKnifeBold,
        prepTime: RiKnifeLine,
        bookmarkFill: PiBookmarkSimpleFill,
        refresh: IoMdRefresh,
        barcode: PiBarcode,
        download: PiDownloadSimple,
        fridge: BiFridge,
        shoppingList: TbListCheck,
        addToFridge: LuLogIn,
        addToShoppingList: TbPlaylistAdd
    }
} as const;
