import type { BlockId, BlockProfile } from "../types/game";

export const blockProfiles: Record<BlockId, BlockProfile> = {
  "north-america": {
    techSensitivity: 1.35,
    socialSensitivity: 1.25,
    climateSensitivity: 0.85,
    militarySensitivity: 1,
    eliteCaptureSensitivity: 1.45,
    aiTrustSensitivity: 1.15,
  },
  europe: {
    techSensitivity: 0.95,
    socialSensitivity: 0.9,
    climateSensitivity: 1.15,
    militarySensitivity: 0.75,
    eliteCaptureSensitivity: 0.85,
    aiTrustSensitivity: 0.8,
  },
  "russia-eurasia": {
    techSensitivity: 0.9,
    socialSensitivity: 1.35,
    climateSensitivity: 0.7,
    militarySensitivity: 1.55,
    eliteCaptureSensitivity: 1.3,
    aiTrustSensitivity: 1.25,
  },
  "industrial-asia": {
    techSensitivity: 1.45,
    socialSensitivity: 0.95,
    climateSensitivity: 1.2,
    militarySensitivity: 0.95,
    eliteCaptureSensitivity: 0.8,
    aiTrustSensitivity: 1.25,
  },
  "emerging-south": {
    techSensitivity: 0.85,
    socialSensitivity: 1.45,
    climateSensitivity: 1.55,
    militarySensitivity: 0.85,
    eliteCaptureSensitivity: 1.15,
    aiTrustSensitivity: 1,
  },
  "latin-america": {
    techSensitivity: 0.85,
    socialSensitivity: 1.35,
    climateSensitivity: 1.2,
    militarySensitivity: 1.1,
    eliteCaptureSensitivity: 1.35,
    aiTrustSensitivity: 0.9,
  },
};
