# Clarity notes

## Capture a question without interrupting your session

- Select **Need clarity?** beside a question. Type a note, paste a dictation transcript, or paste/upload an image.
- Select **Save & return** to keep the note on this device. Closing with unsaved changes asks whether to discard them.
- Use your device's keyboard dictation for voice-to-text. SoS! does not record audio or contact a transcription service.
- Notes retain the class, module, concept, objectives, source references, exact question and visible options. They do not include the answer key.
- Active response timing pauses while the drawer is open. A timed exam's original deadline continues.

## Revisit and learn

- Open **Library → Clarity notes**, or **Review clarity notes** after a session.
- Filter by module and open/resolved status. **Practice these concepts** uses the visible notes' existing question families; it does not create new AI questions.
- Open a note and use **Ask your AI** to copy or download a context prompt. Attach selected images separately when useful; prompts include filenames, not image bytes.
- Your preferred AI receives only what you explicitly share. Ask for a hint, explanation, or source-backed research there; SoS! makes no automatic AI request.
- Check the returned explanation against your course sources, paste it into **What helped**, and mark the note resolved when ready. Notes and resolution never change mastery or scheduling.
- To add new scored questions, use **Create with AI → Add material** and the [source-checking workflow](../methodology/SOURCE_GUIDE.md).

## Save and transfer

- Notes/images have their own **Export notes** and **Load notes** actions in the clarity queue. A progress backup does not contain them.
- Import the matching class first, then load its notes backup. Import replaces that class's notes after confirmation; it does not merge devices.
- Resetting study progress leaves clarity notes intact. Delete notes separately.
- Keep an independent exported copy before clearing browser data or changing browser, profile, folder address, or localhost port.

## Storage and limits

- IndexedDB database `sos-clarity`, store `notes`, uses `[bankId, noteId]` keys and image Blobs. Revision checks reject stale saves, deletion and replacement from other tabs.
- The fallback is text-only localStorage under `sos-clarity:<bankId>:v1`. Image input is disabled there. If storage fails, the unsaved draft stays visible.
- Each note allows three PNG/JPEG/WebP images of up to 4 MB each. Each class allows 200 notes and 24 MB of images. Text and explanation fields each allow 12,000 characters.
- Exported images are base64 in JSON; stored images stay binary. Temporary image preview URLs are revoked when the drawer closes.
- Backups and notes can contain private questions or images. They are not included in public packages.

## Implementation

- [clarity.js](../../clarity.js) owns capture, validation, backup and persistence.
- [clarity-ui.js](../../clarity-ui.js) owns the drawer and queue.
- [Model tests](../../tests/clarity.test.cjs) and [browser checks](../../tools/clarity_browser.cjs) cover persistence, images, backup, conflicts, class isolation and save failures.
