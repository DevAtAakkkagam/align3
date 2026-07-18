import '@fontsource/cinzel/500.css';
import '@fontsource/cinzel/600.css';
import '@fontsource/nunito-sans/400.css';
import '@fontsource/nunito-sans/600.css';
import '@fontsource/nunito-sans/800.css';
import './app.css';
import { mount } from 'svelte';
import App from './lib/components/App.svelte';

const app = mount(App, { target: document.getElementById('app')! });

export default app;
