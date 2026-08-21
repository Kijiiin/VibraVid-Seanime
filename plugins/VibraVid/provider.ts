/// <reference path="../../typings/plugin.d.ts" />
/// <reference path="../../typings/system.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/core.d.ts" />

function init() {
    $ui.register((ctx) => {

        ctx.dom.observe(
            "[data-anime-entry-page]",
            async (els) => {

                const page = els[0];
                if (!page) return;

                try {
                    const media = JSON.parse(
                        (await page.getDataAttribute("media")) ?? "{}"
                    );

                    const title =
                        media.title?.userPreferred ||
                        media.title?.english ||
                        media.title?.romaji;

                    if (!title) {
                        $debug.log("VibraVid: titolo non trovato");
                        return;
                    }

                    // Evita di creare il pulsante più volte
                    const existing = await page.querySelector?.(
                        "[data-vibravid-button]"
                    );

                    if (existing) return;

                    const buttons = LoadDoc(page.innerHTML ?? "");

                    const container = $(
                        "[data-anime-meta-section-buttons-container]"
                    );

                    const firstButton = container
                        .children()
                        .first()
                        .attr("id");

                    if (!firstButton) return;

                    // Titolo codificato come URL
                    const encodedTitle = encodeURIComponent(title);

                    const href = `vibravid://${encodedTitle}`;

                    const button = await ctx.dom.createElement("a");

                    button.setAttribute("href", href);
                    button.setAttribute("target", "_blank");
                    button.setAttribute("data-vibravid-button", "true");

                    button.setInnerHTML(`
                        <button
                            type="button"
                            title="Apri con VibraVid"
                            class="UI-Button_root whitespace-nowrap font-semibold rounded-lg inline-flex items-center transition ease-in text-center justify-center focus-visible:outline-none focus-visible:ring-2 ring-offset-1 ring-offset-[--background] focus-visible:ring-[--ring] disabled:opacity-50 disabled:pointer-events-none shadow-none text-[--gray] border border-transparent bg-transparent hover:underline active:text-gray-700 dark:text-gray-300 dark:active:text-gray-200 UI-IconButton_root p-0 flex-none text-xl h-8 w-8 px-0"
                        >
                            <span class="md:inline-block">
                                <div class="w-5 h-5">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                </div>
                            </span>
                        </button>
                    `);

                    ctx.dom.asElement(firstButton).after(button);

                    $debug.log(
                        `VibraVid: ${title} -> ${href}`
                    );

                } catch (error) {
                    $debug.error(
                        `VibraVid: ${(error as Error).message}`
                    );
                }
            },
            {
                withInnerHTML: true,
                identifyChildren: true
            }
        );
    });
}
