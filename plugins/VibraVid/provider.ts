/// <reference path="../../typings/plugin.d.ts" />
/// <reference path="../../typings/system.d.ts" />
/// <reference path="../../typings/app.d.ts" />
/// <reference path="../../typings/core.d.ts" />

// @ts-ignore
function init() {
	$ui.register((ctx) => {

		ctx.dom.observe(
			"[data-anime-entry-page]",
			async (els) => {
				try {
					const el = els[0];
					if (!el) return;

					// Recupera i dati dell'anime corrente
					const data: $app.AL_BaseAnime = JSON.parse(
						(await el.getDataAttribute("media")) ?? "{}"
					);

					if (!data.id) return;

					// Titolo preferito da usare per la ricerca VibraVid
					const title =
						data.title?.userPreferred ||
						data.title?.english ||
						data.title?.romaji;

					if (!title) {
						$debug.log("VibraVid-Seanime: titolo non trovato");
						return;
					}

					const $ = LoadDoc(el.innerHTML ?? "");

					// Contenitore dei pulsanti dell'anime
					const btnALId = $(
						"[data-anime-meta-section-buttons-container] a"
					).attr("id");

					if (!btnALId) {
						$debug.log(
							"VibraVid-Seanime: contenitore pulsanti non trovato"
						);
						return;
					}

					// Evita duplicati
					const existing = $(
						'[data-vibravid-seanime="true"]'
					).attr("id");

					if (existing) return;

					/*
					 * Protocollo personalizzato.
					 *
					 * Esempio:
					 * VibraVid-Seanime://One Piece
					 */
					const href =
						`VibraVid-Seanime://${title}`;

					const button = await ctx.dom.createElement("a");

					button.setAttribute("href", href);
					button.setAttribute("target", "_blank");
					button.setAttribute(
						"data-vibravid-seanime",
						"true"
					);

					button.setInnerHTML(/*html*/ `
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

					// Inserisce il pulsante dopo AniList
					ctx.dom.asElement(btnALId).after(button);

					$debug.log(
						`VibraVid-Seanime: ${title} -> ${href}`
					);

				} catch (error) {
					$debug.error(
						`VibraVid-Seanime: ${(error as Error).message}`
					);
				}
			},
			{
				withInnerHTML: true,
				identifyChildren: true,
			},
		);
	});
}
