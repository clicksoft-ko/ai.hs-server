import { currentUser } from '@/middlewares/current-user';
import { requireAdmin } from '@/middlewares/require-admin';
import { SftManager } from '@/utils/sftp/sftp-manager';
import express, { Request, Response } from 'express';
import multer from 'multer'

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get(
  "/:fileName",
  async (req: Request, res: Response) => {
    const sftp = new SftManager();
    try {
      await sftp.connect();
      const fileName = req.params.fileName;
      const { buffer, mimeType } = await sftp.getImage(fileName);
      res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
      res.setHeader("Content-Type", mimeType);
      res.send(buffer);
    } catch (err) {
      throw err;
    } finally {
      sftp.end();
    }
  }
)

router.post(
  "/",
  currentUser,
  requireAdmin,
  upload.single("image"),
  async (req: Request, res: Response) => {

    const sftp = new SftManager();

    try {
      if (!req.file) {
        return res.status(400).send("No file uploaded.");
      }

      await sftp.connect();
      const result = await sftp.putImage(req.file);

      res.status(200).send(result);
    } catch (err) {
      throw err;
    } finally {
      sftp.end();
    }
  }
);

router.delete(
  "/:fileName",
  currentUser,
  requireAdmin,
  async (req: Request, res: Response) => {
    const sftp = new SftManager();

    try {
      await sftp.connect();
      const fileName = req.params.fileName;
      await sftp.deleteImage(fileName);

      res.status(200).send({ fileName });
    } catch (err) {
      throw err;
    } finally {
      sftp.end();
    }
  })
export { router as imagesRouter };
