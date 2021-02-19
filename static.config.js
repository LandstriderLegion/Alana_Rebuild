import path from 'path'

const config = {
  siteRoot: "https://rook-platoon.github.io/",
  basePath: "alana.github.io",
  getSiteData: () => ({
    title: 'Alana - Elite Dangerous Tools Suite',
    description: 'Various tools for use with Elite Dangerous'
  }),
  plugins: [
    [
      require.resolve('react-static-plugin-source-filesystem'),
      {
        location: path.resolve('./src/pages'),
      },
    ],
    require.resolve('react-static-plugin-sitemap'),
  ],
}

export default config;