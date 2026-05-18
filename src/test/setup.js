import '@testing-library/jest-dom'

// Ensure jsdom has a working TextEncoder/TextDecoder for libraries that expect it.
import { TextDecoder, TextEncoder } from 'util'

globalThis.TextDecoder = globalThis.TextDecoder ?? TextDecoder

globalThis.TextEncoder = globalThis.TextEncoder ?? TextEncoder

