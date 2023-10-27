import { srngInt } from './random.utils';

export class LoremIpsumGenerator {
    private sentences: string[] = [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Vivamus nec mauris pulvinar leo dignissim sollicitudin eleifend eget ipsum.',
        'Donec accumsan metus et hendrerit venenatis.',
        'Dignissim enim sit amet venenatis urna cursus eget nunc scelerisque.',
        'Risus commodo viverra maecenas accumsan lacus vel facilisis.',
        'Praesent elementum facilisis leo, vel fringilla est ullamcorper eget.',
        'Nulla aliquet enim tortor, at auctor ligula ultrices.',
        'Aliquam id diam maecenas ultricies mi eget mauris pharetra.',
        'Phasellus vitae tellus vel mauris faucibus cursus at eu libero.',
        'Cras tincidunt lobortis feugiat vivamus at augue eget.',
        'In est ante in nibh mauris cursus.',
        'Tincidunt praesent semper feugiat nibh sed pulvinar proin gravida.',
        'Eget nunc lobortis mattis aliquam faucibus purus in massa.',
        'Orci a scelerisque purus semper eget duis at tellus.',
        'At erat pellentesque adipiscing commodo elit at imperdiet dui accumsan.',
        'Sit amet consectetur adipiscing elit duis tristique sollicitudin.',
        'Eget mi proin sed libero enim sed faucibus turpis in eu.',
        'Turpis egestas pretium aenean pharetra magna ac placerat vestibulum.',
        'Ut lectus arcu bibendum at varius vel pharetra vel turpis.',
        'Mauris augue neque gravida in fermentum et sollicitudin ac orci.'
    ];

    public generate(n: number, uid: string, splitParagraphs = false): string {
        let lorem = '';
        const splitAt = splitParagraphs && n > 4 ? srngInt(Math.floor(n / 2) - 1, Math.floor(n / 2) + 1, [uid, 'splitAt']) : null;

        for (let i = 0; i < n; i++) {
            lorem += this.sentences[i % this.sentences.length] + ' ';

            if (splitAt && splitAt === i) {
                lorem += '\n \n';
            }
        }

        return lorem.trim();
    }
}
