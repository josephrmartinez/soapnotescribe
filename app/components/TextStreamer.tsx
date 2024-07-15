'use client';

import React, { useState, useEffect } from 'react';

export default function TextStreamer() {
  const [text, setText] = useState<string[]>([]);
  const [delay, setDelay] = useState<number>(400);
  const [streaming, setStreaming] = useState<boolean>(false);
  const [fade, setFade] = useState<boolean>(false);
  let timeoutIds: NodeJS.Timeout[] = [];

  useEffect(() => {
    if (streaming) {
      let sampleText =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mauris rhoncus aenean vel elit scelerisque mauris. Justo nec ultrices dui sapien eget. Amet mattis vulputate enim nulla. Erat velit scelerisque in dictum non. Viverra nibh cras pulvinar mattis nunc. Nec ullamcorper sit amet risus nullam. Magnis dis parturient montes nascetur ridiculus mus. Aliquet enim tortor at auctor urna nunc. Ut eu sem integer vitae justo. Ipsum suspendisse ultrices gravida dictum. Imperdiet dui accumsan sit amet nulla. Risus at ultrices mi tempus imperdiet nulla malesuada. Interdum velit laoreet id donec ultrices tincidunt arcu. Ante in nibh mauris cursus mattis. Rhoncus dolor purus non enim. Felis bibendum ut tristique et egestas quis. Penatibus et magnis dis parturient montes nascetur. Urna nunc id cursus metus aliquam eleifend mi in nulla. Ipsum nunc aliquet bibendum enim facilisis gravida neque convallis a. Congue quisque egestas diam in arcu cursus euismod quis viverra. Felis imperdiet proin fermentum leo vel orci porta non. Nunc sed augue lacus viverra vitae congue eu consequat. Mi tempus imperdiet nulla malesuada pellentesque elit eget gravida cum. Turpis egestas integer eget aliquet nibh. Maecenas pharetra convallis posuere morbi leo. Pulvinar sapien et ligula ullamcorper malesuada proin libero nunc consequat. Ac tortor vitae purus faucibus ornare suspendisse sed. Aenean vel elit scelerisque mauris. Nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae. Elit eget gravida cum sociis natoque penatibus et magnis. Viverra adipiscing at in tellus integer feugiat.';

      let words = sampleText.split(' ');

      let wordChunks: string[] = words
        .reduce<string[][]>((acc, word, index) => {
          if (index % 4 === 0) acc.push([]);
          acc[acc.length - 1].push(word);
          return acc;
        }, [])
        .map((chunk) => chunk.join(' '));

      for (let i = 0; i < wordChunks.length; i++) {
        timeoutIds[i] = setTimeout(() => {
          setText((prevText) => [...prevText, wordChunks[i]]);
        }, i * delay);
      }

      return () => {
        timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
      };
    } else {
      setText([]);
    }
  }, [streaming, delay]);

  const toggleStreaming = () => {
    setStreaming(!streaming);
  };

  return (
    <div>
      <div className="flex items-center">
        <button
          className="my-4 w-28 rounded-md border py-2 text-center"
          onClick={toggleStreaming}
        >
          {streaming ? 'Stop' : 'Start'}
        </button>

        <div className="ml-6">Delay:</div>
        <input
          className="h-8 w-16 rounded-md border-none"
          type="number"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
        ></input>
        <div>
          <label htmlFor="animation" className="mx-2">
            Fade:
          </label>
          <input
            type="checkbox"
            id="animation"
            name="animation"
            checked={fade}
            onChange={(e) => setFade(e.target.checked)}
          />
        </div>
      </div>
      <div className={``}>
        {text.map((word, index) => (
          <span
            key={index}
            className={`${fade ? 'fade-in-text' : ''} inline-block`}
          >
            {word}&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
}
