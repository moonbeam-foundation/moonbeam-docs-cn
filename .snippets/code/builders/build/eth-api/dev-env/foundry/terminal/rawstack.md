<div id="termynal" data-termynal>
    <span data-ty="input"><span class="file-path"></span>chisel</span>
    <br>
    <span data-ty>Welcome to Chisel! Type `!help` to show available commands.</span>
    <span data-ty="input" data-ty-prompt="➜"> bytes memory myData = abi.encode(100, true, "Develop on Moonbeam");</span>
    <br>
    <span data-ty="input" data-ty-prompt="➜"> !memdump</span>
    <span data-ty>[0x00:0x20]: 0x0000000000000000000000000000000000000000000000000000000000000000</span>
    <span data-ty>[0x20:0x40]: 0x0000000000000000000000000000000000000000000000000000000000000000</span>
    <span data-ty>[0x40:0x60]: 0x0000000000000000000000000000000000000000000000000000000000000140</span>
    <span data-ty>[0x60:0x80]: 0x0000000000000000000000000000000000000000000000000000000000000000</span>
    <span data-ty>[0x80:0xa0]: 0x00000000000000000000000000000000000000000000000000000000000000a0</span>
    <span data-ty>[0xa0:0xc0]: 0x0000000000000000000000000000000000000000000000000000000000000064</span>
    <span data-ty>[0xc0:0xe0]: 0x0000000000000000000000000000000000000000000000000000000000000001</span>
    <span data-ty>[0xe0:0x100]: 0x0000000000000000000000000000000000000000000000000000000000000060</span>
    <span data-ty>[0x100:0x120]: 0x0000000000000000000000000000000000000000000000000000000000000013</span>
    <span data-ty>[0x120:0x140]: 0x446576656c6f70206f6e204d6f6f6e6265616d00000000000000000000000000</span>
    <span data-ty="input" data-ty-prompt="➜"> !rawstack myData </span>
    <br>
    <span data-ty>Type: bytes32 </span>
    <span data-ty>└ Data: 0x0000000000000000000000000000000000000000000000000000000000000080</span>
    <span data-ty="input" data-ty-prompt="➜"> </span>
</div>
