export const UNIT_MAP: Record<string, string> = {
    tbsp: 'tbsp',
    tbsps: 'tbsp',
    tablespoon: 'tbsp',
    tablespoons: 'tbsp',
    tablespoonful: 'tbsp',
    tablespoonfuls: 'tbsp',
    tablespoonfull: 'tbsp',
    tsp: 'tsp',
    tsps: 'tsp',
    teaspoon: 'tsp',
    teaspoons: 'tsp',
    teaspoonful: 'tsp',
    teaspoonfuls: 'tsp',
    teaspoonfull: 'tsp',
    lb: 'lb',
    lbs: 'lb',
    pound: 'lb',
    pounds: 'lb',
    g: 'g',
    gs: 'g',
    gram: 'g',
    grams: 'g',
    gramme: 'g',
    grammes: 'g',
    kg: 'kg',
    kgs: 'kg',
    kilogram: 'kg',
    kilograms: 'kg',
    kilogramme: 'kg',
    kilogrammes: 'kg',
    mg: 'mg',
    mgs: 'mg',
    milligram: 'mg',
    milligrams: 'mg',
    milligramme: 'mg',
    milligrammes: 'mg',
    ml: 'ml',
    mls: 'ml',
    milliliter: 'ml',
    milliliters: 'ml',
    millilitre: 'ml',
    millilitres: 'ml',
    cl: 'cl',
    cls: 'cl',
    centiliter: 'cl',
    centiliters: 'cl',
    centilitre: 'cl',
    centilitres: 'cl',
    l: 'l',
    ls: 'l',
    liter: 'l',
    liters: 'l',
    litre: 'l',
    litres: 'l',
    oz: 'oz',
    ozs: 'oz',
    ounce: 'oz',
    ounces: 'oz',
    pt: 'pt',
    pts: 'pt',
    pint: 'pt',
    pints: 'pt',
    qt: 'qt',
    qts: 'qt',
    quart: 'qt',
    quarts: 'qt',
    gal: 'gal',
    gals: 'gal',
    gallon: 'gal',
    gallons: 'gal',
    c: 'cup',
    cs: 'cup',
    cup: 'cup',
    cups: 'cup',
    pinch: 'pinch',
    pinches: 'pinch',
    dash: 'dash',
    dashes: 'dash',
    drop: 'drop',
    drops: 'drop',
    smidgen: 'smidgen',
    smidgens: 'smidgen',
    smidgeon: 'smidgeon',
    smidgeons: 'smidgeon',
    stick: 'stick',
    sticks: 'stick',
    knob: 'knob',
    knobs: 'knob',
    slice: 'slice',
    slices: 'slice',
    piece: 'piece',
    pieces: 'piece',
    cube: 'cube',
    cubes: 'cube',
    tin: 'tin',
    tins: 'tin',
    can: 'can',
    cans: 'can',
    bottle: 'bottle',
    bottles: 'bottle',
    jar: 'jar',
    jars: 'jar',
    box: 'box',
    boxes: 'box',
    packet: 'packet',
    packets: 'packet',
    package: 'package',
    packages: 'package',
    bunch: 'bunch',
    bunches: 'bunch',
    sprig: 'sprig',
    sprigs: 'sprig'
};
export const FRACTION_MAP: Record<string, string> = {
    '¼': '1/4',
    '½': '1/2',
    '¾': '3/4',
    '⅐': '1/7',
    '⅑': '1/9',
    '⅒': '1/10',
    '⅓': '1/3',
    '⅔': '2/3',
    '⅕': '1/5',
    '⅖': '2/5',
    '⅗': '3/5',
    '⅘': '4/5',
    '⅙': '1/6',
    '⅚': '5/6',
    '⅛': '1/8',
    '⅜': '3/8',
    '⅝': '5/8',
    '⅞': '7/8'
};
export const VALID_PREP_STYLES = [
    'chopped',
    'fresh',
    'sliced',
    'minced',
    'large',
    'grated',
    'dried',
    'peeled',
    'diced',
    'ground',
    'small',
    'crushed',
    'boneless',
    'skinless',
    'medium',
    'shredded',
    'whole',
    'unsalted',
    'cooked',
    'plain',
    'frozen',
    'dry',
    'drained',
    'toasted',
    'mixed',
    'deseeded',
    'heavy',
    'mild',
    'divided',
    'optional',
    'cracked',
    'extra-virgin',
    'extra virgin',
    'heaped',
    'full',
    'cubed',
    'beaten',
    'granulated',
    'packed',
    'canned',
    'quartered',
    'washed',
    'organic',
    'melted',
    'roasted',
    'thickened',
    'softened',
    'salted',
    'trimmed',
    'tinned',
    'deveined',
    'seasoned',
    'rinsed',
    'lean',
    'natural',
    'julienned',
    'regular',
    'streaky',
    'separated',
    'crumbled',
    'boiled',
    'raw',
    'steamed',
    'strong',
    'mature',
    'uncooked',
    'powdered',
    'spicy',
    'unpeeled',
    'flaked',
    'homemade',
    'squeezed',
    'chilled',
    'firm',
    'ripe',
    'wild',
    'mashed',
    'deboned',
    'smashed',
    'halved',
    'thawed',
    'pitted',
    'unsweetened',
    'flavoured',
    'round',
    'chunky',
    'smooth',
    'clear',
    'blanched',
    'refrigerated',
    'pounded',
    'slivered',
    'whisked',
    'broken',
    'crispy',
    'distilled',
    'wholemeal',
    'jointed',
    'flanken',
    'fermented',
    'squashed',
    'shaved',
    'shelled',
    'semi-skimmed',
    'full-fat',
    'skimmed',
    'baked',
    'creamy',
    'overripe',
    'marinated',
    'crunchy',
    'evaporated',
    'petite',
    'stripped',
    'sifted',
    'pricked',
    'seeded',
    'loose',
    'diluted',
    'juiced',
    'sweetened',
    'strained',
    'pre-cooked',
    'flaky',
    'concentrated',
    'skinned',
    'coarse',
    'dissolved',
    'cleaned',
    'desseeded',
    'jarred',
    'unseasoned',
    'tender',
    'cored',
    'leafed',
    'desiccated',
    'clarified',
    'creamed',
    'settled',
    'runny',
    'unprocessed',
    'bashed',
    'soaked',
    'pickled',
    'warmed',
    'cured',
    'scrubbed',
    'scored',
    'rolled',
    'flavourless',
    'flavorless',
    'unflavored',
    'unbleached',
    'unrefined',
    'unsmoked',
    'zested',
    'zest of',
    'to taste',
    'chopped into chunks',
    'chopped into wedges',
    'sliced lengthwise',
    'sliced crosswise',
    'sliced into rounds',
    'sliced into strips',
    'sliced into halves',
    'sliced into quarters',
    'sliced into cubes',
    'sliced into pieces',
    'sliced into segments',
    'sliced into florets',
    'sliced into spears',
    'sliced into batons',
    'sliced into rings',
    'cut into chunks',
    'cut into wedges',
    'cut lengthwise',
    'cut crosswise',
    'cut into rounds',
    'cut into strips',
    'cut in half',
    'cut into halves',
    'cut into quarters',
    'cut into cubes',
    'cut into pieces',
    'cut into segments',
    'cut into florets',
    'cut into spears',
    'cut into batons',
    'cut into rings',
    'cut into slices',
    'cut into slivers'
];
export const VALID_PREP_STYLE_MODIFIERS = [
    'very',
    'finely',
    'freshly',
    'thinly',
    'coarsely',
    'roughly',
    'lightly',
    'thickly',
    'evenly',
    'sparsely',
    'generously',
    'tightly',
    'loosely',
    'delicately',
    'moderately',
    'heavily',
    'lightly',
    'crisply',
    'smoothly',
    'partially',
    'fully',
    'uniformly',
    'randomly',
    'gradually',
    'tenderly',
    'firmly',
    'artfully',
    'skillfully',
    'meticulously',
    'elegantly',
    'symmetrically',
    'asymmetrically'
];