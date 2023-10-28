import axios from "axios";

const GITBOOK_API = process.env.GITBOOK_KEY
const GITBOOK_URL = process.env.GITBOOK_URL
const GITBOOK_SPACE_TERMS = process.env.GITBOOK_SPACE_TERMS_ID

export const fetchGitBook = async () => {
  try {
    const res = await axios.get(`${GITBOOK_URL}/spaces/${GITBOOK_SPACE_TERMS}/content`, {
      headers: {
        Authorization: `Bearer ${GITBOOK_API}`
      }
    });

    return res.data;
  } catch (err) {
    console.error('Error fetching content from GitBook:', err);
    throw err;
  }
}
