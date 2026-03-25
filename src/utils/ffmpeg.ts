import config from "../config.js";
import ffmpeg from "fluent-ffmpeg"
import logger from "./logger.js";
import { execSync } from "child_process";

const ffmpegRunning: { [key: string]: boolean } = {};

export function verifyFfmpeg(): boolean {
	try {
		const version = execSync('ffmpeg -version', { encoding: 'utf-8' });
		logger.info("✓ ffmpeg verified:", version.split('\n')[0]);
		return true;
	} catch (err) {
		logger.error("✗ ffmpeg not found or not accessible:", err instanceof Error ? err.message : String(err));
		return false;
	}
}

export async function ffmpegScreenshot(video: string): Promise<string[]> {
	return new Promise<string[]>((resolve, reject) => {
		if (ffmpegRunning[video]) {
			// Wait for ffmpeg to finish
			const wait = (images: string[]) => {
				if (ffmpegRunning[video] == false) {
					resolve(images);
				}
				setTimeout(() => wait(images), 100);
			}
			wait([]);
			return;
		}
		ffmpegRunning[video] = true;
		const ts = ['10%', '30%', '50%', '70%', '90%'];
		const images: string[] = [];

		const takeScreenshots = (i: number) => {
			if (i >= ts.length) {
				ffmpegRunning[video] = false;
				resolve(images);
				return;
			}
			ffmpeg(`${config.videosDir}/${video}`)
				.on("end", () => {
					const screenshotPath = `${config.previewCacheDir}/${video}-${i + 1}.jpg`;
					images.push(screenshotPath);
					takeScreenshots(i + 1);
				})
				.on("error", (err: Error) => {
					ffmpegRunning[video] = false;
					reject(err);
				})
				.screenshots({
					count: 1,
					filename: `${video}-${i + 1}.jpg`,
					timestamps: [ts[i]],
					folder: config.previewCacheDir
				});
		};

		takeScreenshots(0);
	});
}

// Checking video params
export async function getVideoParams(videoPath: string): Promise<{ width: number, height: number, bitrate: string, maxbitrate: string, fps: number }> {
	return new Promise((resolve, reject) => {
		ffmpeg.ffprobe(videoPath, (err, metadata) => {
			if (err) {
				return reject(err);
			}

			const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');

			if (videoStream && videoStream.width && videoStream.height && videoStream.bit_rate) {
				const rFrameRate = videoStream.r_frame_rate || videoStream.avg_frame_rate;

				if (rFrameRate) {
					const [numerator, denominator] = rFrameRate.split('/').map(Number);
					videoStream.fps = numerator / denominator;
				} else {
					videoStream.fps = 0
				}

				resolve({ width: videoStream.width, height: videoStream.height, bitrate: videoStream.bit_rate, maxbitrate: videoStream.maxBitrate, fps: videoStream.fps });
			} else {
				reject(new Error('Unable to get Resolution.'));
			}
		});
	});
}

