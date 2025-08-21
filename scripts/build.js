const esbuild = require('esbuild');
const fs = require('fs').promises;
const path = require('path');

const isWatch = process.argv.includes('--watch');
const isProduction = process.env.NODE_ENV === 'production';

// Build configuration
const baseConfig = {
  entryPoints: ['src/index.js'],
  bundle: true,
  format: 'iife',
  target: ['es2015'],
  platform: 'browser',
  globalName: 'UpliftNarrator',
  metafile: true,
  logLevel: 'info',
};

// Banner for the built files
const banner = `/**
 * Uplift Narrator v${require('../package.json').version}
 * (c) ${new Date().getFullYear()} Uplift AI
 * @license MIT
 */`;

async function clean() {
  try {
    await fs.rm('dist', { recursive: true, force: true });
    await fs.mkdir('dist', { recursive: true });
  } catch (error) {
    // Directory might not exist, that's ok
  }
}

async function build() {
  try {
    console.log('🧹 Cleaning dist directory...');
    await clean();
    
    console.log('📦 Building uplift-narrator...\n');
    
    // Development build
    const devResult = await esbuild.build({
      ...baseConfig,
      outfile: 'dist/uplift-narrator.js',
      minify: false,
      sourcemap: true,
      banner: { js: banner },
    });
    
    console.log('✓ Built dist/uplift-narrator.js');
    
    // Production build
    const prodResult = await esbuild.build({
      ...baseConfig,
      outfile: 'dist/uplift-narrator.min.js',
      minify: true,
      sourcemap: false,
      banner: { js: banner },
      legalComments: 'none',
      pure: ['console.log'],
      drop: isProduction ? ['console', 'debugger'] : [],
    });
    
    console.log('✓ Built dist/uplift-narrator.min.js');
    
    // IIFE build for CDN/script tag usage (works like UMD)
    await esbuild.build({
      ...baseConfig,
      outfile: 'dist/uplift-narrator.iife.js',
      format: 'iife',
      minify: true,
      sourcemap: false,
      banner: { js: banner },
      footer: { js: 'if(typeof module!=="undefined")module.exports=UpliftNarrator;' },
    });
    
    console.log('✓ Built dist/uplift-narrator.iife.js');
    
    // ES Module build
    await esbuild.build({
      entryPoints: ['src/index.js'],
      outfile: 'dist/uplift-narrator.esm.js',
      format: 'esm',
      bundle: true,
      minify: true,
      target: ['es2020'],
      platform: 'browser',
      banner: { js: banner },
    });
    
    console.log('✓ Built dist/uplift-narrator.esm.js\n');
    
    // Print build stats
    if (prodResult.metafile) {
      const analysis = await esbuild.analyzeMetafile(prodResult.metafile);
      console.log('📊 Build Analysis:');
      console.log(analysis);
    }
    
    // Get file sizes
    const stats = await fs.stat('dist/uplift-narrator.min.js');
    const statsIife = await fs.stat('dist/uplift-narrator.iife.js');
    const statsEsm = await fs.stat('dist/uplift-narrator.esm.js');
    
    console.log('\n📏 File Sizes:');
    console.log(`  • uplift-narrator.min.js: ${(stats.size / 1024).toFixed(2)}KB`);
    console.log(`  • uplift-narrator.iife.js: ${(statsIife.size / 1024).toFixed(2)}KB`);
    console.log(`  • uplift-narrator.esm.js: ${(statsEsm.size / 1024).toFixed(2)}KB`);
    
    console.log('\n✨ Build completed successfully!');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

async function watch() {
  console.log('👀 Watching for changes...\n');
  
  const ctx = await esbuild.context({
    ...baseConfig,
    outfile: 'dist/uplift-narrator.js',
    minify: false,
    sourcemap: true,
    banner: { js: banner },
  });
  
  await ctx.watch();
  console.log('✓ Watching src/index.js for changes...');
  console.log('Press Ctrl+C to stop\n');
}

// Run the appropriate build
if (isWatch) {
  watch();
} else {
  build();
}