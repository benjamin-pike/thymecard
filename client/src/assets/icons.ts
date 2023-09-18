import { BiFridge, BiLink } from 'react-icons/bi';
import { BsChevronDown, BsQuestionLg } from 'react-icons/bs';
import { FaInfo } from 'react-icons/fa6';
import { FiEdit2, FiPrinter } from 'react-icons/fi';
import { GrFormSearch, GrUndo } from 'react-icons/gr';
import { HiOutlineDocumentAdd, HiOutlineDocumentDuplicate } from 'react-icons/hi';
import { IoIosClose, IoMdRefresh } from 'react-icons/io';
import { IoCheckmark, IoCloseOutline } from 'react-icons/io5';
import { LuFileDown, LuFileOutput, LuLogIn, LuMoreHorizontal } from 'react-icons/lu';
import { MdFilterList, MdOutlineCalendarMonth } from 'react-icons/md';
import { PiBarcode, PiBookmarkSimple, PiBookmarkSimpleFill, PiForkKnifeBold, PiListBold, PiMinus, PiPencilSimple, PiPlus, PiTrashSimpleBold } from 'react-icons/pi';
import { RiHomeLine, RiKnifeLine, RiScales2Line, RiStarFill, RiStarHalfLine, RiStarLine, RiListUnordered, RiFullscreenLine, RiFullscreenExitLine } from 'react-icons/ri';
import { TbChefHat, TbFileUpload, TbListCheck, TbPlaylistAdd } from 'react-icons/tb';


export const ICONS = {
    common: {
        XSmall: IoIosClose,
        XLarge: IoCloseOutline,
        search: GrFormSearch,
        toggle: BsChevronDown,
        back: GrUndo,
        home: RiHomeLine,
        star: RiStarLine,
        starHalfFill: RiStarHalfLine,
        starFill: RiStarFill,
        plus: PiPlus,
        minus: PiMinus,
        refresh: IoMdRefresh,
        ellipsis: LuMoreHorizontal,
        list: PiListBold,
        pen: FiEdit2,
        tick: IoCheckmark,
        enterFullscreen: RiFullscreenLine,
        exitFullscreen: RiFullscreenExitLine,
        delete: PiTrashSimpleBold,
        planner: MdOutlineCalendarMonth,
        question: BsQuestionLg,
        info: FaInfo
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
        bookmark: PiBookmarkSimple,
        bookmarkFill: PiBookmarkSimpleFill,
        barcode: PiBarcode,
        download: LuFileDown,
        export: LuFileOutput,
        fridge: BiFridge,
        shoppingList: TbListCheck,
        addToFridge: LuLogIn,
        addToShoppingList: TbPlaylistAdd,
        scales: RiScales2Line,
        ingredients: RiListUnordered,
        print: FiPrinter
    }
} as const;
