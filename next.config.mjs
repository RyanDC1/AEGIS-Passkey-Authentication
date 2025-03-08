import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.optimization.minimizer.push(
            new ImageMinimizerPlugin({
                test: /\.(jpe?g|png|svg)$/i,
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        plugins: [
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            [
                                "svgo",
                                {
                                    plugins: [
                                        {
                                            name: "preset-default",
                                        },
                                    ],
                                },
                            ],
                        ]
                    },
                },
            }),
        )
        return config
    }
};

export default nextConfig;
