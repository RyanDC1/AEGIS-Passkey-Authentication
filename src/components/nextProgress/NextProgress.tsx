'use client'
import { Next13ProgressBar as ProgressBar } from 'next13-progressbar';

export default function NextProgress() {
    return (
        <ProgressBar
            height="3px"
            color="#fffd00c2"
            options={{ showSpinner: false }}
            showOnShallow={false}
        />
    )
}