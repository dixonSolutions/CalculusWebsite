// PWA Installation Debug Script
// Copy and paste this into your browser console on the deployed site

console.log('🔍 PWA Installation Debug Check');
console.log('=====================================');

// Check if this script is running on HTTPS
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    console.error('❌ PWA requires HTTPS. Current protocol:', location.protocol);
} else {
    console.log('✅ Running on HTTPS');
}

// Check Service Worker support
if ('serviceWorker' in navigator) {
    console.log('✅ Service Worker API supported');
    
    // Check for existing service worker registrations
    navigator.serviceWorker.getRegistrations().then(registrations => {
        console.log(`📊 Found ${registrations.length} service worker registrations`);
        
        if (registrations.length === 0) {
            console.warn('⚠️ No service workers registered');
        } else {
            registrations.forEach((reg, index) => {
                console.log(`SW ${index + 1}:`, {
                    scope: reg.scope,
                    state: reg.active?.state,
                    scriptURL: reg.active?.scriptURL
                });
            });
        }
    });
} else {
    console.error('❌ Service Worker not supported');
}

// Check manifest
const manifestLink = document.querySelector('link[rel="manifest"]');
if (manifestLink) {
    console.log('✅ Manifest link found:', manifestLink.href);
    
    // Try to fetch and validate manifest
    fetch(manifestLink.href)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(manifest => {
            console.log('✅ Manifest loaded successfully:', manifest);
            
            // Check required PWA criteria
            const checks = [
                { name: 'name', value: manifest.name, required: true },
                { name: 'short_name', value: manifest.short_name, required: true },
                { name: 'icons', value: manifest.icons, required: true },
                { name: 'start_url', value: manifest.start_url, required: true },
                { name: 'display', value: manifest.display, required: true },
                { name: 'theme_color', value: manifest.theme_color, required: false }
            ];
            
            console.log('\n📋 Manifest Requirements Check:');
            let allRequired = true;
            
            checks.forEach(check => {
                if (check.required && !check.value) {
                    console.error(`❌ Missing required field: ${check.name}`);
                    allRequired = false;
                } else if (check.value) {
                    console.log(`✅ ${check.name}:`, check.value);
                } else {
                    console.log(`ℹ️ Optional ${check.name}: not set`);
                }
            });
            
            // Check icons specifically
            if (manifest.icons && manifest.icons.length > 0) {
                console.log('\n🖼️ Icon Check:');
                const requiredSizes = ['192x192', '512x512'];
                const availableSizes = manifest.icons.map(icon => icon.sizes);
                
                requiredSizes.forEach(size => {
                    if (availableSizes.includes(size)) {
                        console.log(`✅ ${size} icon found`);
                    } else {
                        console.warn(`⚠️ ${size} icon missing (recommended)`);
                    }
                });
            }
            
            if (allRequired) {
                console.log('\n🎉 All required manifest fields present!');
            }
        })
        .catch(error => {
            console.error('❌ Failed to load manifest:', error);
        });
} else {
    console.error('❌ No manifest link found in HTML');
}

// Check for beforeinstallprompt event
let installPromptEvent = null;
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('🎉 beforeinstallprompt event fired - PWA is installable!');
    installPromptEvent = e;
});

// Check if already installed
window.addEventListener('appinstalled', (e) => {
    console.log('✅ App was installed');
});

// Check display mode
const displayMode = window.matchMedia('(display-mode: standalone)').matches ? 
    'standalone' : 'browser';
console.log('📱 Current display mode:', displayMode);

// Additional checks
console.log('\n🔧 Additional Information:');
console.log('User Agent:', navigator.userAgent);
console.log('Current URL:', location.href);
console.log('Document ready state:', document.readyState);

// Manual installation trigger (if available)
setTimeout(() => {
    if (installPromptEvent) {
        console.log('\n🚀 Install prompt is available. You can manually trigger it.');
        console.log('Run: installPromptEvent.prompt() to show install dialog');
        window.installPromptEvent = installPromptEvent; // Make it available globally
    } else {
        console.log('\n⏳ Install prompt not yet available or criteria not met');
        console.log('This could be due to:');
        console.log('1. Service worker not yet registered/active');
        console.log('2. Not enough user engagement');
        console.log('3. PWA criteria not fully met');
        console.log('4. App already installed');
    }
}, 3000);

console.log('\n✨ Debug check complete!');
console.log('If you see any ❌ or ⚠️ above, those need to be fixed for PWA installation.'); 