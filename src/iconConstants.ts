/**
 * SVG string for treeview icons required for web-extension support
 */
export class IconConstants {

    public static TEST: string = "test";

    public static nodeIcons: string[] = [
        // 0 - 7
        '<path d="M0 4v9h15.15V4zm1 1h13.15v7H1z" fill="#a4a59e"/>',
        '<path d="M0 4v9h15.15V4zm1 1h13.15v7H1z" fill="#a4a59e"/><path d="M9.075 6v5h4.075V6zm1 1h2.076v3h-2.076z" fill="#42a5f5"/>',
        '<path d="M7.074 4.5v8h1v-8z" fill="#e54a16"/><path d="M0 4v9h15.15V4zm1 1h13.15v7H1z" fill="#a4a59e"/>',
        '<path d="M7.074 4.5v8h1v-8z" fill="#e54a16"/><path d="M0 4v9h15.15V4zm1 1h13.15v7H1z" fill="#a4a59e"/><path d="M9.075 6v5h4.075V6zm1 1h2.076v3h-2.076z" fill="#42a5f5"/>',
        '<path d="M0 4v9h15.15V4zm1 1h13.15v7H1z" fill="#a4a59e"/><path d="M3.56 5.65v2h1v-.279a1.5 1.5 0 11-2.27 1.904l-.923.395A2.5 2.5 0 006.074 8.5a2.5 2.5 0 00-.824-1.85h.31v-1z" fill="#e54a16"/>',
        '<path d="M0 4v9h15.15V4zm1 1h13.15v7H1z" fill="#a4a59e"/><path d="M9.075 6v5h4.075V6zm1 1h2.076v3h-2.076z" fill="#42a5f5"/><path d="M3.56 5.65v2h1v-.279a1.5 1.5 0 11-2.27 1.904l-.923.395A2.5 2.5 0 006.074 8.5a2.5 2.5 0 00-.824-1.85h.31v-1z" fill="#e54a16"/>',
        '<path d="M7.074 4.5v8h1v-8z" fill="#e54a16"/><path d="M0 4v9h15.15V4zm1 1h13.15v7H1z" fill="#a4a59e"/><path d="M3.56 5.65v2h1v-.279a1.5 1.5 0 11-2.27 1.904l-.923.395A2.5 2.5 0 006.074 8.5a2.5 2.5 0 00-.824-1.85h.31v-1z" fill="#e54a16"/>',
        '<path d="M7.074 4.5v8h1v-8z" fill="#e54a16"/><path d="M0 4v9h15.15V4zm1 1h13.15v7H1z" fill="#a4a59e"/><path d="M9.075 6v5h4.075V6zm1 1h2.076v3h-2.076z" fill="#42a5f5"/><path d="M3.56 5.65v2h1v-.279a1.5 1.5 0 11-2.27 1.904l-.923.395A2.5 2.5 0 006.074 8.5a2.5 2.5 0 00-.824-1.85h.31v-1z" fill="#e54a16"/>',
        // 8 - 15
        '<path d="M0 4v9h15.15V4zm1 1h13.15v7H1z" fill="#4d4d4d"/>',
        '<path d="M0 4v9h15.15V4zm1 1h13.15v7H1z" fill="#4d4d4d"/><path d="M9.075 6v5h4.075V6zm1 1h2.076v3h-2.076z" fill="#42a5f5"/>',
        '<path d="M7.074 4.5v8h1v-8z" fill="#e54a16"/><path d="M0 4v9h15.15V4zm1 1h13.15v7H1z" fill="#4d4d4d"/>',
        '<path d="M7.074 4.5v8h1v-8z" fill="#e54a16"/><path d="M0 4v9h15.15V4zm1 1h13.15v7H1z" fill="#4d4d4d"/><path d="M9.075 6v5h4.075V6zm1 1h2.076v3h-2.076z" fill="#42a5f5"/>',
        '<path d="M0 4v9h15.15V4zm1 1h13.15v7H1z" fill="#4d4d4d"/><path d="M3.56 5.65v2h1v-.279a1.5 1.5 0 11-2.27 1.904l-.923.395A2.5 2.5 0 006.074 8.5a2.5 2.5 0 00-.824-1.85h.31v-1z" fill="#e54a16"/>',
        '<path d="M0 4v9h15.15V4zm1 1h13.15v7H1z" fill="#4d4d4d"/><path d="M9.075 6v5h4.075V6zm1 1h2.076v3h-2.076z" fill="#42a5f5"/><path d="M3.56 5.65v2h1v-.279a1.5 1.5 0 11-2.27 1.904l-.923.395A2.5 2.5 0 006.074 8.5a2.5 2.5 0 00-.824-1.85h.31v-1z" fill="#e54a16"/>',
        '<path d="M7.074 4.5v8h1v-8z" fill="#e54a16"/><path d="M0 4v9h15.15V4zm1 1h13.15v7H1z" fill="#4d4d4d"/><path d="M3.56 5.65v2h1v-.279a1.5 1.5 0 11-2.27 1.904l-.923.395A2.5 2.5 0 006.074 8.5a2.5 2.5 0 00-.824-1.85h.31v-1z" fill="#e54a16"/>',
        '<path d="M7.074 4.5v8h1v-8z" fill="#e54a16"/><path d="M0 4v9h15.15V4zm1 1h13.15v7H1z" fill="#4d4d4d"/><path d="M9.075 6v5h4.075V6zm1 1h2.076v3h-2.076z" fill="#42a5f5"/><path d="M3.56 5.65v2h1v-.279a1.5 1.5 0 11-2.27 1.904l-.923.395A2.5 2.5 0 006.074 8.5a2.5 2.5 0 00-.824-1.85h.31v-1z" fill="#e54a16"/>'
    ];

    public static scriptButtons: string[] = [
        '<path fill="#c5c5c5" d="M14 7v1H8v6H7V8H1V7h6V1h1v6h6z"/>',
        '<path fill="#424242" d="M14 7v1H8v6H7V8H1V7h6V1h1v6h6z"/>'
    ];
    public static button: string[] = [
        '<path d="M2.202 6.678c-.388.34-.42.704-.42 1.3.235 1.64 3.04 2.669 5.85 2.679 2.795.01 5.64-.986 5.958-2.582l.002-.027c.043-.616-.048-.946-.39-1.25-.3-.2-.527-.24-.718.025 0 1.242-2.145 2.248-4.79 2.249-2.647 0-4.793-1.007-4.794-2.249.001-.056-.102-.201-.2-.282-.158-.09-.386.03-.498.137z" fill="#c5c5c5" fill-opacity=".250"/><path style="shape-padding:0;isolation:auto;mix-blend-mode:normal;solid-color:#000;solid-opacity:1" d="M7.697 1.219c-1.368 0-2.61.258-3.552.707-.842.4-1.504.99-1.637 1.756-.043.148-.018.268-.03.423v1.5C1.575 6.141.915 6.844.823 7.711c-.027.13-.01.271-.013.414v2.357h.003c.004.077.014.153.026.227.155.972 1 1.746 2.125 2.281 1.246.593 2.904.94 4.734.94s3.493-.347 4.74-.94c1.126-.535 1.972-1.31 2.126-2.283.033-.147.019-.251.029-.398V8.082c.019-.139-.015-.256-.022-.377-.082-.752-.576-1.385-1.3-1.889-.12-.078-.237-.157-.352-.236V4.086c-.003-.136-.015-.236-.022-.352-.11-.79-.781-1.4-1.642-1.808-.944-.45-2.189-.707-3.557-.707zm0 1c1.24 0 2.36.244 3.125.61.68.322 1.015.7 1.074 1.028.01.133.015.313.019.522.012.662.003 1.624.003 2.355l-.002.028a1.505 1.505 0 01-.05.293c-.03.071-.075.144-.132.218-.629.691-1.493.887-2.297 1.112a8.893 8.893 0 01-3.355.017c-.04-.007-.084-.01-.123-.017h-.002c-.812-.114-1.408-.452-2.039-.85h-.002a1.421 1.421 0 01-.353-.416c-.075-.1-.075-.224-.083-.33V4.148c.002-.177.004-.125.01-.28.057-.326.394-.712 1.084-1.04.766-.364 1.884-.61 3.123-.61zM2.48 6.809c-.002.09.019.184.028.27.128.77.791 1.366 1.638 1.769.943.448 2.183.705 3.551.705 1.368 0 2.613-.257 3.557-.705.853-.406 1.522-1.007 1.642-1.787.02-.095.015-.162.022-.252.355.299.574.61.638.978.044.176.02.277.036.49v1.961c.017.204-.015.188-.031.383-.122.495-.631 1.028-1.553 1.467-1.068.508-2.609.842-4.31.842-1.703 0-3.237-.334-4.305-.842-.891-.424-1.398-.935-1.541-1.416-.012-.064-.03-.127-.043-.19V8.266c-.016-.3-.018-.553.16-.852.11-.215.282-.413.511-.605z" fill="#c5c5c5"/><path d="M7.697 2.219c-1.239 0-2.357.245-3.123.61-.655.31-.984.673-1.064.987a4.241 1.794 0 00-.02.159 4.241 1.794 0 004.242 1.793 4.241 1.794 0 004.18-1.504 10.7 10.7 0 00-.016-.407c-.06-.328-.395-.706-1.074-1.029-.765-.365-1.885-.61-3.125-.61z" fill="#c5c5c5" fill-opacity=".250"/>',
        '<path d="M1.777 7.966v2.885c.085.408.031.125.043.189 1.254 1.878 3.933 2.045 5.877 2.059 2.33-.098 4.586-.247 5.887-2.088.016-.195.048-.178.031-.382V7.966c-.198 1.667-3.12 2.718-5.982 2.708-2.821-.01-5.638-1.057-5.856-2.708z" fill="#424242" fill-opacity=".250"/><path d="M3.426 5.35v1.83c.008.106.008.23.082.33 2.407 1.93 6.178 1.828 8.412-.065a1.49 1.49 0 00.053-.32V3.924c-.625 2.272-6.566 2.393-8.18.66-.182-.197-.31-.417-.338-.539z" fill="#424242" fill-opacity=".250"/><path d="M7.697 1.219c-1.368 0-2.61.258-3.552.707-.842.4-1.504.99-1.637 1.756-.043.148-.018.268-.03.423v1.5C1.575 6.141.915 6.844.823 7.711c-.027.13-.01.271-.013.414v2.357h.003c.004.077.014.153.026.227.155.972 1 1.746 2.125 2.281 1.246.593 2.904.94 4.734.94s3.493-.347 4.74-.94c1.126-.535 1.972-1.31 2.126-2.283.033-.147.019-.251.029-.398V8.082c.019-.139-.015-.256-.022-.377-.082-.752-.576-1.385-1.3-1.889-.12-.078-.237-.157-.352-.236V4.086c-.003-.136-.015-.236-.022-.352-.11-.79-.781-1.4-1.642-1.808-.944-.45-2.189-.707-3.557-.707zm0 1c1.24 0 2.36.244 3.125.61.68.322 1.015.7 1.074 1.028.01.133.015.313.019.522.012.662.003 1.624.003 2.355l-.002.028a1.505 1.505 0 01-.05.293c-.03.071-.075.144-.132.218-.629.691-1.493.887-2.297 1.112a8.893 8.893 0 01-3.355.017c-.04-.007-.084-.01-.123-.017h-.002c-.812-.114-1.408-.452-2.039-.85h-.002a1.421 1.421 0 01-.353-.416c-.075-.1-.075-.224-.083-.33V4.148c.002-.177.004-.125.01-.28.057-.326.394-.712 1.084-1.04.766-.364 1.884-.61 3.123-.61zM2.48 6.809c-.002.09.019.184.028.27.128.77.791 1.366 1.638 1.769.943.448 2.183.705 3.551.705 1.368 0 2.613-.257 3.557-.705.853-.406 1.522-1.007 1.642-1.787.02-.095.015-.162.022-.252.355.299.574.61.638.978.044.176.02.277.036.49v1.961c.017.204-.015.188-.031.383-.122.495-.631 1.028-1.553 1.467-1.068.508-2.609.842-4.31.842-1.703 0-3.237-.334-4.305-.842-.891-.424-1.398-.935-1.541-1.416-.012-.064-.03-.127-.043-.19V8.266c-.016-.3-.018-.553.16-.852.11-.215.282-.413.511-.605z" style="shape-padding:0;isolation:auto;mix-blend-mode:normal;solid-color:#000;solid-opacity:1" fill="#424242"/>'
    ];

    public static leoDocuments: string[] = [
        '<path d="M2.875 1.21h10.566v8.482H2.875z" fill="#7c2504"/><path d="M11.093 1.21c-1.14.782-1.827 2.105-1.828 3.523 0 1.747 1.023 3.246 2.482 3.89v6.021h1.694V1.21zm-8.218 0V14.88h1.713V9.009a4.073 4.225 0 003.167-4.115A4.073 4.225 0 005.673 1.21z" fill="#b04620"/><path d="M6.35 6.339c.12.188.21.425.174.645-.245.565-.76 1.076-1.191 1.44-.73.668-1.442.894-2.433.993V4.002C4 4.79 5.58 5.269 6.35 6.339z" fill="#c96b4b"/><path d="M4.332 8.389c-.158 0-.79.316-.79.316l-.65.561h-.07l-.034 3.3.333.28.562-.105c.37-.073.72-.394 1.106-.368 0 0-.368.375-.457.614-.177.595-.124 1.405.334 1.79.25.201.612.202.93.246 1.464-.037 4.222.01 5.74.035.626-.22.74-.879.841-1.422.07-.409.049-.903-.193-1.21-.215-.265-.877-.527-.877-.527s1.117.332 1.68.482c.2.054.601.15.601.15l.123-3.844-1.035-.298-1.176.07c-1.934.446-3.108.225-4.914.245l-1.053-.28s-.843-.035-1-.035z" fill="#e4dcc8"/><path d="M4.708 2.514c-.947.022-1.475.03-1.808 1.194-.061.43.13.923.439 1.228.415.386 1.612.462 2.264.738.249.037.546.14.755 0 .277-.202.345-.987.473-1.37.003-.511-.243-1.192-.649-1.597-.477-.294-.98-.212-1.474-.193zm7.065.1c-.2.002-.405.024-.613.036-.518-.066-.748.086-.983.526-.343.738-.604 2.514.21 2.878.915.34 1.406-.481 2.001-.824.271-.149.585-.198.878-.299.049-1.108.161-1.483-.51-2.018-.322-.249-.648-.301-.983-.298z" fill="#f9f2b3"/><path d="M2.49.713V10l-1.516.143a.334.334 0 10.063.666l1.453-.138v.59l-1.483.288a.334.334 0 10.127.656l1.356-.263v3.349H13.88v-4.025h1.032a.334.334 0 100-.67h-1.032v-.64l1.054-.108a.334.334 0 10-.067-.665l-.987.101V.713H2.49zm.905.905h9.579v2.411a1.607 1.607 0 00-.088-.224c-.315-.63-.738-.878-1.277-.857-.636.001-1.105.415-1.342 1.009-.152.398-.113.704-.09 1.082.016.24.4.593.692.537.453-.088 1.18-.482 1.757-.765.18-.088.289-.19.348-.303v4.869l-2.427.246a.334.334 0 10.067.665l2.36-.24v.549h-2.405a.334.334 0 100 .669h2.405v3.12H3.395v-.677c.117.087.348.15.436.11.33-.153.357-.46.749-.83.182-.171.323-.42.599-.562.246-.126.727-.052 1.452-.207 1.346-.232 2.858-.122 3.97.085.707.134.891.457 1.033.776.11.248.07.353.247.558.137.16.505.353.716.169.168-.147 0-.502.182-.682.204-.204.28-.442.007-.745-.902-.485-1.542-.586-2.66-.737-.199-.02-.316-.245-.461-.38-.345-.32-.675-.483-1.103-.532.016-.055.037-.204.068-.244.695-.897 1.659-1.467 2.392-1.634.273-.062.157-.392.093-.431-.145-.088-.331-.093-.5-.093-.319.001-.633.08-.95.098-.952.054-1.783.082-2.651.006-.287-.025-.576-.058-.864-.046-.463.02-.554.254-.43.598.045.128.579.135.84.272.423.22.632.51 1.103 1.097.058.071.126.137.167.218.023.046.023.1.03.15-.514.002-.712.127-1.025.46-.363.38-.283.403-1.243.553-.22.034-.458.033-.678.069-.413.067-1.056.097-1.375.472-.062.073-.1.14-.143.208v-.719l2.476-.48a.334.334 0 10-.128-.657l-2.348.456v-.5l2.445-.231a.334.334 0 10-.063-.666l-2.382.225v-5.62c.2.094.516.16.657.221.442.194.737.484 1.025.634.18.094.866.282 1.016.147.222-.2.262-1.117.074-1.538a2.12 2.12 0 00-.651-.854c-.09-.072-.43-.153-.68-.148-.25.004-.556.053-.711.091-.315.079-.473.259-.683.505-.012.012-.031.05-.047.076z" fill="#1c0e01"/><path d="M4.487 3.186c-.11.182-.05.382.062.533.094.125.222.226.36.298.222.11.36.162.484-.062.151-.264.091-.52-.112-.72-.23-.204-.581-.277-.794-.05zm7 .26c-.326.03-.478.33-.472.633a.91.91 0 00.162.385c.247-.037.604-.197.769-.36.093-.133.21-.369.149-.509-.152-.191-.403-.18-.608-.149z" fill="#fff"/>',
        '<path fill="#3b0000" d="M2.875 1.21h10.566v8.482H2.875z"/><path fill="#6f0500" d="M11.093 1.21c-1.14.782-1.827 2.105-1.828 3.523 0 1.747 1.023 3.246 2.482 3.89v6.021h1.694V1.21zm-8.218 0v13.67h1.713V9.009a4.073 4.225 0 003.167-4.115A4.073 4.225 0 005.673 1.21z"/><path fill="#882a0a" d="M6.35 6.339c.12.188.21.425.174.645-.245.565-.76 1.076-1.191 1.44-.73.668-1.442.894-2.433.993V4.002C4 4.79 5.58 5.269 6.35 6.339z"/><path fill="#a39b87" d="M4.332 8.389c-.158 0-.79.316-.79.316l-.65.561h-.07l-.034 3.3.333.28.562-.105c.37-.073.72-.394 1.106-.368 0 0-.368.375-.457.614-.177.595-.124 1.405.334 1.79.25.201.612.202.93.246 1.464-.037 4.222.01 5.74.035.626-.22.74-.879.841-1.422.07-.409.049-.903-.193-1.21-.215-.265-.877-.527-.877-.527s1.117.332 1.68.482c.2.054.601.15.601.15l.123-3.844-1.035-.298-1.176.07c-1.934.446-3.108.225-4.914.245l-1.053-.28s-.843-.035-1-.035z"/><path fill="#b8b172" d="M4.708 2.514c-.947.022-1.475.03-1.808 1.194-.061.43.13.923.439 1.228.415.386 1.612.462 2.264.738.249.037.546.14.755 0 .277-.202.345-.987.473-1.37.003-.511-.243-1.192-.649-1.597-.477-.294-.98-.212-1.474-.193zm7.065.1c-.2.002-.405.024-.613.036-.518-.066-.748.086-.983.526-.343.738-.604 2.514.21 2.878.915.34 1.406-.481 2.001-.824.271-.149.585-.198.878-.299.049-1.108.161-1.483-.51-2.018-.322-.249-.648-.301-.983-.298z"/><path fill="#1f0f01" d="M2.49.713V10l-1.516.143a.334.334 0 10.063.666l1.453-.138v.59l-1.483.288a.334.334 0 10.127.656l1.356-.263v3.349h11.39v-4.025h1.032a.334.334 0 100-.67H13.88v-.64l1.054-.108a.334.334 0 10-.067-.665l-.987.101V.713H2.49zm.905.905h9.579v2.411a1.607 1.607 0 00-.088-.224c-.315-.63-.738-.878-1.277-.857-.636.001-1.105.415-1.342 1.009-.152.398-.113.704-.09 1.082.016.24.4.593.692.537.453-.088 1.18-.482 1.757-.765.18-.088.289-.19.348-.303v4.869l-2.427.246a.334.334 0 10.067.665l2.36-.24v.549h-2.405a.334.334 0 100 .669h2.405v3.12H3.395v-.677c.117.087.348.15.436.11.33-.153.357-.46.749-.83.182-.171.323-.42.599-.562.246-.126.727-.052 1.452-.207 1.346-.232 2.858-.122 3.97.085.707.134.891.457 1.033.776.11.248.07.353.247.558.137.16.505.353.716.169.168-.147 0-.502.182-.682.204-.204.28-.442.007-.745-.902-.485-1.542-.586-2.66-.737-.199-.02-.316-.245-.461-.38-.345-.32-.675-.483-1.103-.532.016-.055.037-.204.068-.244.695-.897 1.659-1.467 2.392-1.634.273-.062.157-.392.093-.431-.145-.088-.331-.093-.5-.093-.319.001-.633.08-.95.098-.952.054-1.783.082-2.651.006-.287-.025-.576-.058-.864-.046-.463.02-.554.254-.43.598.045.128.579.135.84.272.423.22.632.51 1.103 1.097.058.071.126.137.167.218.023.046.023.1.03.15-.514.002-.712.127-1.025.46-.363.38-.283.403-1.243.553-.22.034-.458.033-.678.069-.413.067-1.056.097-1.375.472-.062.073-.1.14-.143.208v-.719l2.476-.48a.334.334 0 10-.128-.657l-2.348.456v-.5l2.445-.231a.334.334 0 10-.063-.666l-2.382.225v-5.62c.2.094.516.16.657.221.442.194.737.484 1.025.634.18.094.866.282 1.016.147.222-.2.262-1.117.074-1.538a2.12 2.12 0 00-.651-.854c-.09-.072-.43-.153-.68-.148-.25.004-.556.053-.711.091-.315.079-.473.259-.683.505-.012.012-.031.05-.047.076z"/><path fill="#fff" d="M4.487 3.186c-.11.182-.05.382.062.533.094.125.222.226.36.298.222.11.36.162.484-.062.151-.264.091-.52-.112-.72-.23-.204-.581-.277-.794-.05zm7 .26c-.326.03-.478.33-.472.633a.91.91 0 00.162.385c.247-.037.604-.197.769-.36.093-.133.21-.369.149-.509-.152-.191-.403-.18-.608-.149z"/>',
        '<path d="M2.875 1.21h10.566v8.482H2.875z" fill="#7c2504"/><path d="M11.093 1.21c-1.14.782-1.827 2.105-1.828 3.523 0 1.747 1.023 3.246 2.482 3.89v6.021h1.694V1.21zm-8.218 0V14.88h1.713V9.009a4.073 4.225 0 003.167-4.115A4.073 4.225 0 005.673 1.21z" fill="#b04620"/><path d="M6.35 6.339c.12.188.21.425.174.645-.245.565-.76 1.076-1.191 1.44-.73.668-1.442.894-2.433.993V4.002C4 4.79 5.58 5.269 6.35 6.339z" fill="#c96b4b"/><path d="M4.332 8.389c-.158 0-.79.316-.79.316l-.65.561h-.07l-.034 3.3.333.28.562-.105c.37-.073.72-.394 1.106-.368 0 0-.368.375-.457.614-.177.595-.124 1.405.334 1.79.25.201.612.202.93.246 1.464-.037 4.222.01 5.74.035.626-.22.74-.879.841-1.422.07-.409.049-.903-.193-1.21-.215-.265-.877-.527-.877-.527s1.117.332 1.68.482c.2.054.601.15.601.15l.123-3.844-1.035-.298-1.176.07c-1.934.446-3.108.225-4.914.245l-1.053-.28s-.843-.035-1-.035z" fill="#e4dcc8"/><path d="M4.708 2.514c-.947.022-1.475.03-1.808 1.194-.061.43.13.923.439 1.228.415.386 1.612.462 2.264.738.249.037.546.14.755 0 .277-.202.345-.987.473-1.37.003-.511-.243-1.192-.649-1.597-.477-.294-.98-.212-1.474-.193zm7.065.1c-.2.002-.405.024-.613.036-.518-.066-.748.086-.983.526-.343.738-.604 2.514.21 2.878.915.34 1.406-.481 2.001-.824.271-.149.585-.198.878-.299.049-1.108.161-1.483-.51-2.018-.322-.249-.648-.301-.983-.298z" fill="#f9f2b3"/><path d="M2.49.713V10l-1.516.143a.334.334 0 10.063.666l1.453-.138v.59l-1.483.288a.334.334 0 10.127.656l1.356-.263v3.349H13.88v-4.025h1.032a.334.334 0 100-.67h-1.032v-.64l1.054-.108a.334.334 0 10-.067-.665l-.987.101V.713H2.49zm.905.905h9.579v2.411a1.607 1.607 0 00-.088-.224c-.315-.63-.738-.878-1.277-.857-.636.001-1.105.415-1.342 1.009-.152.398-.113.704-.09 1.082.016.24.4.593.692.537.453-.088 1.18-.482 1.757-.765.18-.088.289-.19.348-.303v4.869l-2.427.246a.334.334 0 10.067.665l2.36-.24v.549h-2.405a.334.334 0 100 .669h2.405v3.12H3.395v-.677c.117.087.348.15.436.11.33-.153.357-.46.749-.83.182-.171.323-.42.599-.562.246-.126.727-.052 1.452-.207 1.346-.232 2.858-.122 3.97.085.707.134.891.457 1.033.776.11.248.07.353.247.558.137.16.505.353.716.169.168-.147 0-.502.182-.682.204-.204.28-.442.007-.745-.902-.485-1.542-.586-2.66-.737-.199-.02-.316-.245-.461-.38-.345-.32-.675-.483-1.103-.532.016-.055.037-.204.068-.244.695-.897 1.659-1.467 2.392-1.634.273-.062.157-.392.093-.431-.145-.088-.331-.093-.5-.093-.319.001-.633.08-.95.098-.952.054-1.783.082-2.651.006-.287-.025-.576-.058-.864-.046-.463.02-.554.254-.43.598.045.128.579.135.84.272.423.22.632.51 1.103 1.097.058.071.126.137.167.218.023.046.023.1.03.15-.514.002-.712.127-1.025.46-.363.38-.283.403-1.243.553-.22.034-.458.033-.678.069-.413.067-1.056.097-1.375.472-.062.073-.1.14-.143.208v-.719l2.476-.48a.334.334 0 10-.128-.657l-2.348.456v-.5l2.445-.231a.334.334 0 10-.063-.666l-2.382.225v-5.62c.2.094.516.16.657.221.442.194.737.484 1.025.634.18.094.866.282 1.016.147.222-.2.262-1.117.074-1.538a2.12 2.12 0 00-.651-.854c-.09-.072-.43-.153-.68-.148-.25.004-.556.053-.711.091-.315.079-.473.259-.683.505-.012.012-.031.05-.047.076z" fill="#1c0e01"/><path d="M4.487 3.186c-.11.182-.05.382.062.533.094.125.222.226.36.298.222.11.36.162.484-.062.151-.264.091-.52-.112-.72-.23-.204-.581-.277-.794-.05zm7 .26c-.326.03-.478.33-.472.633a.91.91 0 00.162.385c.247-.037.604-.197.769-.36.093-.133.21-.369.149-.509-.152-.191-.403-.18-.608-.149z" fill="#fff"/>',
        '<path d="M2.875 1.21h10.566v8.482H2.875z" fill="#b45d3c"/><path d="M11.093 1.21c-1.14.782-1.827 2.105-1.828 3.523 0 1.747 1.023 3.246 2.482 3.89v6.021h1.694V1.21zm-8.218 0v13.67h1.713V9.009a4.073 4.225 0 003.167-4.115A4.073 4.225 0 005.673 1.21z" fill="#e87e58"/><path d="M6.35 6.339c.12.188.21.425.174.645-.245.565-.76 1.076-1.191 1.44-.73.668-1.442.894-2.433.993V4.002C4 4.79 5.58 5.269 6.35 6.339z" fill="#ffa383"/><path d="M4.332 8.389c-.158 0-.79.316-.79.316l-.65.561h-.07l-.034 3.3.333.28.562-.105c.37-.073.72-.394 1.106-.368 0 0-.368.375-.457.614-.177.595-.124 1.405.334 1.79.25.201.612.202.93.246 1.464-.037 4.222.01 5.74.035.626-.22.74-.879.841-1.422.07-.409.049-.903-.193-1.21-.215-.265-.877-.527-.877-.527s1.117.332 1.68.482c.2.054.601.15.601.15l.123-3.844-1.035-.298-1.176.07c-1.934.446-3.108.225-4.914.245l-1.053-.28s-.843-.035-1-.035z" fill="#fff"/><path d="M4.708 2.514c-.947.022-1.475.03-1.808 1.194-.061.43.13.923.439 1.228.415.386 1.612.462 2.264.738.249.037.546.14.755 0 .277-.202.345-.987.473-1.37.003-.511-.243-1.192-.649-1.597-.477-.294-.98-.212-1.474-.193zm7.065.1c-.2.002-.405.024-.613.036-.518-.066-.748.086-.983.526-.343.738-.604 2.514.21 2.878.915.34 1.406-.481 2.001-.824.271-.149.585-.198.878-.299.049-1.108.161-1.483-.51-2.018-.322-.249-.648-.301-.983-.298z" fill="#ffffeb"/><path d="M2.49.713V10l-1.516.143a.334.334 0 10.063.666l1.453-.138v.59l-1.483.288a.334.334 0 10.127.656l1.356-.263v3.349h11.39v-4.025h1.032a.334.334 0 100-.67H13.88v-.64l1.054-.108a.334.334 0 10-.067-.665l-.987.101V.713H2.49zm.905.905h9.579v2.411a1.607 1.607 0 00-.088-.224c-.315-.63-.738-.878-1.277-.857-.636.001-1.105.415-1.342 1.009-.152.398-.113.704-.09 1.082.016.24.4.593.692.537.453-.088 1.18-.482 1.757-.765.18-.088.289-.19.348-.303v4.869l-2.427.246a.334.334 0 10.067.665l2.36-.24v.549h-2.405a.334.334 0 100 .669h2.405v3.12H3.395v-.677c.117.087.348.15.436.11.33-.153.357-.46.749-.83.182-.171.323-.42.599-.562.246-.126.727-.052 1.452-.207 1.346-.232 2.858-.122 3.97.085.707.134.891.457 1.033.776.11.248.07.353.247.558.137.16.505.353.716.169.168-.147 0-.502.182-.682.204-.204.28-.442.007-.745-.902-.485-1.542-.586-2.66-.737-.199-.02-.316-.245-.461-.38-.345-.32-.675-.483-1.103-.532.016-.055.037-.204.068-.244.695-.897 1.659-1.467 2.392-1.634.273-.062.157-.392.093-.431-.145-.088-.331-.093-.5-.093-.319.001-.633.08-.95.098-.952.054-1.783.082-2.651.006-.287-.025-.576-.058-.864-.046-.463.02-.554.254-.43.598.045.128.579.135.84.272.423.22.632.51 1.103 1.097.058.071.126.137.167.218.023.046.023.1.03.15-.514.002-.712.127-1.025.46-.363.38-.283.403-1.243.553-.22.034-.458.033-.678.069-.413.067-1.056.097-1.375.472-.062.073-.1.14-.143.208v-.719l2.476-.48a.334.334 0 10-.128-.657l-2.348.456v-.5l2.445-.231a.334.334 0 10-.063-.666l-2.382.225v-5.62c.2.094.516.16.657.221.442.194.737.484 1.025.634.18.094.866.282 1.016.147.222-.2.262-1.117.074-1.538a2.12 2.12 0 00-.651-.854c-.09-.072-.43-.153-.68-.148-.25.004-.556.053-.711.091-.315.079-.473.259-.683.505-.012.012-.031.05-.047.076z" fill="#4d4d4d"/><path d="M4.487 3.186c-.11.182-.05.382.062.533.094.125.222.226.36.298.222.11.36.162.484-.062.151-.264.091-.52-.112-.72-.23-.204-.581-.277-.794-.05zm7 .26c-.326.03-.478.33-.472.633a.91.91 0 00.162.385c.247-.037.604-.197.769-.36.093-.133.21-.369.149-.509-.152-.191-.403-.18-.608-.149z" fill="#fff"/>'
    ];


}