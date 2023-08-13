export const toolTipTexts = {
    'guidance_scale': 'Guidance scale defines how closely the AI should stick to your prompt. Min is 0 and max is 20. Lower values give AI more freedom to explore.',
    'seed': 'A random number the AI uses along with prompt to produce the image. Same seed + prompt = same image. You can keep the seed same while tweaking the prompt to get images in a cohesive style. Leave blank for random seed.',
    'remix': 'Remix takes the existing image as base and converts it to new image based on your updated prompt. You can use it to change the colour of hair, dress or add things like spectacles, hat etc.'
}

export const samplePrompts = [
    'Disney, Snow White, long hair, (cum on face and hair), nude, naked, perfect breasts, perfect fingers',
    'Disney style, girl playing a piano, nude, naked, perfect breasts, perfect hands and fingers',
    'emma watson, meditating, nude, naked, perfect breasts, perfect fingers',
    'Ultra realistic 8k photograph,picture-perfect face,flawless, clean, masterpiece, professional artwork, famous artwork,perfect face, beautiful face, beautiful eyes,((perfect female body, narrow waist,nude)),black hair,huge breasts,crown,nsfw,breasts out,soft light,absurdly long hair,very long hair, (rich:1.4),(high detailed skin:1.2),sexy, charming, alluring, seductive, erotic, enchanting,lovely,vagina, dark studio,Bokeh,',
    'Cute fairy in a glass jar filled with water, smiling, fully nude',
    'Oil painting, nude girl,  golden tiara, nude, naked, judging crowd in the background, close shot at from the side, crawling on the street, beautiful expressive eyes, seductive look, ((on all fours lead through city streets)), tension, dangerous atmosphere, torch light, city square at night after revolution, masterpiece, cinematic light, nude, naked',
    'Oil portrait featuring broken automata girls, fully nude, full body, steampunk machines ((gear pupils)), machine eyes, cinematic lighting, highres, good saturation, color gradient, multicolored hair',
    '2girls, nude, dark skin, from behind, ass, looking back, indoors, pussy, smiling, animal ears, bedroom, long hair, yellow eyes, breast on breast, fox tail, tongue',
    '1girl, 1boy, spread legs, sex, nude, medium breasts, penis, vaginal, open mouth, brown eyes, long hair, cum, black hair, on bed, pov, stomach bulge,',
    '1girl, long black hair, smiling, gym, karate, fighting, naked,',
    '1girl, pink eyes, long hair, red hair, (temple in the background), sitting, kimono, medium breasts, topless, light smile, wide hips, arms behind back',
    '1girl, white hair, green eyes, looking up, floating hair, butterfly, from side, wings, nature, topless, perfect tits',
    '((beautiful asian)) 1woman, ((beautiful kimono)), ((no panty)), ((trimmed pussy:1.3)), detailed, squatting bending over, spreading legs apart, rain, (translucent clothes), (cleavage:0.7), ((medium breasts)), (sideboob), (wet body), pavement, messy bun, long hair coming down on shoulders, sweaty body, blush, grey eyes, black hair, smiling at viewer, happy expression, (detailed pussy:1.4), ((sakura blooms background)), (darkened background)',
    'absurdres, 1girl, nude, red hair, long hair, forest, perfect breasts, shaved vagina, sitting on a tree branch',
    '1girl, white hair, green eyes, looking up, floating hair, butterfly, from side, wings, nature, topless, perfect tits',
    '1girl, long black hair, smiling, gym, karate, fighting, naked,',
    '1girl, long hair, glasses, burger, bored, braid, naked, perfect breasts', ,
    '1girl, 1boy, vaginal, doggystyle, sex, blonde hair, nude, bra, bottomless,',
    '1girl, 1boy, very long hair, nude, red eyes, black hair, fellatio, nipples, sucking penis, mountains',
    '1 girl, standing, train interior, brown eyes, pointing at viewer, (police), angry, hat, no pants, see through top, clean pussy, naked, nude',
    'absurdres, 1girl, nude, red hair, long hair, forest, perfect breasts, shaved vagina, sitting on a tree branch',
    'realistic, 1girl, ponytail, parted lips, blush, makeup, light smile, white hair, sportswear, skirt, see through clothes, visible nipples, perfect tits, glow, thighs, purple eye, bare shoulders, collarbone, narrow waist, sunbeam, sunlight, rose, wind, nude, (masterpiece), sweat',
    '2 big boob topless waifus hugging each other, long hair',
    '1girl rin tohsaka, dancefloor, upper body, ((2boy)), pov, brown hair, long hair, ((blue eyes)), ((naked)),  (((buckake))) (((exhausted))), ((((covered with sperm)))), medium breasts, (((messy, cum shot, sweating)))',
    '((beautiful asian)) 1woman, ((beautiful kimono)), ((no panty)), ((trimmed pussy:1.3)), detailed, squatting bending over, spreading legs apart, rain, (translucent clothes), (cleavage:0.7), ((medium breasts)), (sideboob), (wet body), pavement, messy bun, long hair coming down on shoulders, sweaty body, blush, grey eyes, black hair, smiling at viewer, happy expression, (detailed pussy:1.4), ((sakura blooms background)), (darkened background)',
    '1girl, blue eyes, long blond hair, (japanese city in background), sitting, kimono, medium breasts, topless, light smile, arms behind back, [nipples], night, beautiful, water',
    '1girl, pink eyes, long hair, black hair, (temple in the background), sitting, kimono, medium breasts, topless, light smile, wide hips, arms behind back',
    '((beautiful asian)) multiple woman, ((one piece short dress)), ((no panties)), detailed, squatting bending over, spreading legs apart, rain, (translucent clothes), (cleavage:0.7), ((medium breasts)), (sideboob), (wet body), pavement, messy bun, long hair coming down on shoulders, sweaty body, blush, grey eyes, ((cameltoe:1.3)), black hair, smiling at viewer, happy expression, (open crotch), ((sakura blooms background)), (darkened background)'
];


export const tiers = [
    {
        name: 'Monthly',
        id: 'tier-monthly',
        href: 'https://onlyhentai.gumroad.com/l/jhbig',
        price: '$9.99',
        frequency: '/month',
        description: "All the features for a pocket price!",
        features: ['1000 images / mo', 'Medium priority queue', 'High quality', 'Advanced options', 'text-2-img & img-2-img'],
        featured: false,
    },
    {
        name: 'Annual',
        id: 'tier-annual',
        href: 'https://onlyhentai.gumroad.com/l/jhbig',
        frequency: '/year',
        price: '$50',
        description: 'Huge savings. Faster generations. Super resolution.',
        features: [
            '50% off once',
            '1000 images / mo',
            'High priority queue',
            'Super Resoultion',
            'Advanced Options',
            'text-2-img & img-2-img',
            'Early access to new features'
        ],
        featured: true,
    },
]

export const defaultNegativePrompt = '[worst quality], [low quality], bad legs, bad arms, deformed body parts, low res, blurry, worst quality, extra limbs, bad quality, ugly, text, logo, signature, greyscale, bokeh, sepia, monochrome, disfigured, bad anatomy, extra limbs, bokeh, poorly drawn, washed out, zombie, (interlocked fingers:1.2), multiple views';
