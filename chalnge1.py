#!/usr/bin/env python3
"""
generate_exfil_pcap.py
Generates a PCAP that contains exfiltrated data split across DNS-like UDP queries
and HTTP-like TCP packets. Produces `exfil.pcap` by default.

Usage:
    python3 generate_exfil_pcap.py --out exfil.pcap
"""

import argparse
import io
import tarfile
import base64
import base64 as b64
from scapy.all import Ether, IP, UDP, DNS, DNSQR, TCP, Raw, wrpcap
import math
import time

def make_tar_with_flag(flag_string: str) -> bytes:
    bio = io.BytesIO()
    with tarfile.open(fileobj=bio, mode='w:gz') as tar:
        info = tarfile.TarInfo(name="flag.txt")
        data = flag_string.encode()
        info.size = len(data)
        tar.addfile(info, io.BytesIO(data))
    return bio.getvalue()

def chunk_string(s: str, size:int):
    for i in range(0, len(s), size):
        yield s[i:i+size]

def build_packets(encoded_str: str, chunk_size:int=48):
    packets = []
    seq = 1
    ts = time.time()
    for chunk in chunk_string(encoded_str, chunk_size):
        seq_str = f"{seq:04d}"
        # DNS-like UDP packet with qname containing seq-chunk
        label = f"{seq_str}-{chunk}"
        # make a plausible qname by appending a local domain
        qname = f"{label}.example.local.".encode()
        dns_pkt = Ether()/IP(src="10.0.0.1", dst="10.0.0.53")/UDP(sport=40000+seq%1000, dport=53)/DNS(rd=1,qd=DNSQR(qname=qname))
        dns_pkt.time = ts
        packets.append(dns_pkt)
        ts += 0.0001

        # HTTP-like TCP packet with User-Agent containing seq and chunk
        ua_val = f"Exfil/{seq_str}-{chunk}"
        http_payload = f"GET / HTTP/1.1\r\nHost: victim.local\r\nUser-Agent: {ua_val}\r\n\r\n".encode()
        tcp_pkt = Ether()/IP(src="10.0.0.1", dst="10.0.0.80")/TCP(sport=50000+seq%1000, dport=80, seq=1000+seq)/Raw(load=http_payload)
        tcp_pkt.time = ts
        packets.append(tcp_pkt)
        ts += 0.0001

        seq += 1
    return packets

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--flag", default="CSA{pcap_dns_http_exfil_2025}", help="Flag to embed")
    parser.add_argument("--out", default="exfil.pcap", help="Output pcap filename")
    parser.add_argument("--chunk", default=48, type=int, help="Chunk size for base32 pieces")
    args = parser.parse_args()

    tar_bytes = make_tar_with_flag(args.flag)
    # Use base32 encoding for DNS-friendly alphabet
    b32 = base64.b32encode(tar_bytes).decode().strip('=')
    packets = build_packets(b32, chunk_size=args.chunk)
    print(f"Generated {len(packets)} packets containing {math.ceil(len(b32)/args.chunk)} chunks.")
    wrpcap(args.out, packets)
    print(f"Wrote PCAP to {args.out}")

if __name__ == "__main__":
    main()
