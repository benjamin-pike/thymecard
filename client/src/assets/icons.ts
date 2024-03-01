import { BiCopy, BiFoodMenu, BiFridge, BiLink, BiPieChartAlt2, BiSolidFoodMenu } from 'react-icons/bi';
import { BsArrowRightShort, BsCalendar3, BsChevronDown, BsChevronLeft, BsChevronRight, BsQuestionLg } from 'react-icons/bs';
import { CgSpinnerTwoAlt } from 'react-icons/cg';
import { FaCaretDown, FaFacebook, FaGoogle, FaInfo, FaRegClock } from 'react-icons/fa6';
import { FiEdit2, FiPrinter } from 'react-icons/fi';
import { GrFormSearch, GrUndo } from 'react-icons/gr';
import { HiOutlineDocumentAdd, HiOutlineDocumentDuplicate } from 'react-icons/hi';
import { IoIosClose, IoIosTimer, IoMdEye, IoMdRefresh } from 'react-icons/io';
import { IoCheckmark, IoCloseOutline, IoPerson } from 'react-icons/io5';
import {
    LuActivity,
    LuBanana,
    LuCoffee,
    LuFileDown,
    LuFileOutput,
    LuGlassWater,
    LuIceCream2,
    LuLogIn,
    LuMoreHorizontal,
    LuRepeat,
    LuSalad,
    LuSoup
} from 'react-icons/lu';
import { MdFilterList, MdOutlineArrowDropDownCircle, MdOutlineCalendarMonth } from 'react-icons/md';
import {
    PiBarcode,
    PiBookmarkSimple,
    PiBookmarkSimpleFill,
    PiCookingPotBold,
    PiForkKnifeBold,
    PiListBold,
    PiMinus,
    PiPencilSimple,
    PiPlus,
    PiTimer,
    PiTrashSimpleBold,
    PiUploadSimple,
    PiWarningBold
} from 'react-icons/pi';

import {
    RiHomeLine,
    RiKnifeLine,
    RiScales2Line,
    RiStarFill,
    RiStarHalfLine,
    RiStarLine,
    RiListUnordered,
    RiFullscreenLine,
    RiFullscreenExitLine
} from 'react-icons/ri';
import { TbChefHat, TbFileUpload, TbGenderFemale, TbGenderMale, TbGenderThird, TbListCheck, TbPlaylistAdd } from 'react-icons/tb';

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
        info: FaInfo,
        pieChart: BiPieChartAlt2,
        arrowRight: BsArrowRightShort,
        calendar: BsCalendar3,
        chevronLeft: BsChevronLeft,
        chevronRight: BsChevronRight,
        upload: PiUploadSimple,
        recipe: BiFoodMenu,
        recipeFill: BiSolidFoodMenu,
        copy: BiCopy,
        genderMale: TbGenderMale,
        genderFemale: TbGenderFemale,
        genderOther: TbGenderThird,
        caret: FaCaretDown,
        person: IoPerson,
        repeat: LuRepeat,
        time: FaRegClock,
        duration: PiTimer,
        dropdown: MdOutlineArrowDropDownCircle,
        loading: CgSpinnerTwoAlt,
        warning: PiWarningBold
    },
    auth: {
        google: FaGoogle,
        facebook: FaFacebook,
        eye: IoMdEye
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
        cookTime: PiCookingPotBold,
        totalTime: IoIosTimer,
        bookmark: PiBookmarkSimple,
        bookmarkFill: PiBookmarkSimpleFill,
        barcode: PiBarcode,
        download: LuFileDown,
        export: LuFileOutput,
        fridge: BiFridge,
        tickList: TbListCheck,
        addToFridge: LuLogIn,
        addToShoppingList: TbPlaylistAdd,
        scales: RiScales2Line,
        ingredients: RiListUnordered,
        print: FiPrinter
    },
    events: {
        breakfast: LuCoffee,
        lunch: LuSoup,
        dinner: LuSalad,
        snack: LuBanana,
        drink: LuGlassWater,
        dessert: LuIceCream2,
        activity: LuActivity
    }
} as const;
