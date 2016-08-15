import PyPDF2
import sys

# TODO: add all of the bits to make the output valid PDF/A3.  See tests at:
# http://www.pdf-tools.com/pdf/validate-pdfa-online.aspx

# Current errors:
# The file header format does not conform to the standard.
# The comment, classifying the file as containing 8-bit binary data, is missing.
# The file trailer dictionary must have an id key.
# The key Metadata is required but missing.
# The key MarkInfo is required but missing.
# The value of the key file specification dictionary must be an indirect object.
# The key UF is required but missing.
# The key Subtype is required but missing.
# The key AFRelationship is required but missing.
# The key F is required but missing. (12)
# A device-specific color space (DeviceRGB) without an appropriate output intent is used.
# A device-specific color space (DeviceGray) without an appropriate output intent is used.
# File specification 'test.x.xml' not associated with an object.
# The document does not conform to the requested standard.
# The file format (header, trailer, objects, xref, streams) is corrupted.
# The document doesn't conform to the PDF reference (missing required entries, wrong value types, etc.).
# The document contains device-specific color spaces.
# The document contains hidden, invisible, non-viewable or non-printable annotations.
# The document's meta data is either missing or inconsistent or corrupt.
# The document doesn't provide appropriate logical structure information.

if len(sys.argv) < 4:
    print("Usage: %s [PDF file] [XML file] [output file]")
    sys.exit(64)

pdf = PyPDF2.PdfFileReader(sys.argv[1])
o = PyPDF2.PdfFileWriter()
o.appendPagesFromReader(pdf)
xml = open(sys.argv[2], 'rb').read()

o.addAttachment(sys.argv[2], xml)
of = open(sys.argv[3], 'wb')
o.write(of)
